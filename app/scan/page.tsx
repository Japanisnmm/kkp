'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHNInput, setShowHNInput] = useState(false);
  const [hnNumber, setHNNumber] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Cannot access camera. Please allow camera access.');
    }
  };

  useEffect(() => {
    if (!capturedImage) {
      setupCamera();
    }

    // Cleanup
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [capturedImage]);

  const takePhoto = () => {
    if (!videoRef.current) return;

    // Create canvas and capture image
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    
    if (!context) {
      setError('Could not create canvas context');
      return;
    }

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Save captured image and show confirmation
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
    setIsConfirming(true);
  };

  const confirmPhoto = async () => {
    if (!capturedImage) return;

    try {
      setLoading(true);
      setError(null);

      // Convert to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // Create FormData and send
      const formData = new FormData();
      formData.append('test_image', blob, 'photo.jpg');

      const apiResponse = await fetch('https://kkp-s.stewlab.win/recognize', {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await apiResponse.json();
      console.log('Response:', data);

      if (data.patients && data.patients.length > 0) {
        // Stop camera before navigation
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
        
        const patientHN = data.patients[0].hn;
        router.push(`/scan/aboutprofile?hn=${patientHN}`);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setShowHNInput(true);
        } else {
          setError(`ไม่พบข้อมูลผู้ป่วย กรุณาถ่ายภาพใหม่อีกครั้ง (ครั้งที่ ${newAttempts}/3)`);
          setCapturedImage(null);
          setIsConfirming(false);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsConfirming(false);
  };

  const handleHNSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('hn', hnNumber);

      const response = await fetch('https://kkp-s.stewlab.win/recognize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit HN');
      }

      const data = await response.json();
      
      if (data.patients && data.patients.length > 0) {
        // Stop camera before navigation
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
        
        router.push(`/scan/aboutprofile?hn=${hnNumber}`);
      } else {
        setError('ไม่พบข้อมูลผู้ป่วยจากหมายเลข HN นี้');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  if (showHNInput) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                setShowHNInput(false);
                setError(null);
                setupCamera();
              }}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
              ย้อนกลับ
            </button>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            กรุณากรอกหมายเลข HN
          </h2>
          <form onSubmit={handleHNSubmit} className="space-y-4">
            <input
              type="text"
              value={hnNumber}
              onChange={(e) => setHNNumber(e.target.value)}
              placeholder="กรอกหมายเลข HN"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full bg-blue-500 text-white py-2 rounded-lg
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
              `}
            >
              {loading ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Camera Feed or Captured Image */}
      <div className="relative h-screen">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="absolute min-w-full min-h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute min-w-full min-h-full object-cover"
          />
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center gap-4 bg-gradient-to-t from-black/50 to-transparent">
        {/* Camera Controls */}
        <div className="flex justify-center gap-4">
          {capturedImage && isConfirming ? (
            <>
              <button
                onClick={retakePhoto}
                disabled={loading}
                className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center transition-all duration-200 hover:bg-red-500/20"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-red-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
              <button
                onClick={confirmPhoto}
                disabled={loading}
                className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center transition-all duration-200 hover:bg-green-500/20"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-10 w-10 text-green-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={takePhoto}
              disabled={loading}
              className={`
                w-20 h-20 rounded-full border-4 border-white
                flex items-center justify-center
                transition-all duration-200
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}
              `}
            >
              <div className="w-16 h-16 rounded-full bg-white" />
            </button>
          )}
        </div>

        {/* Manual HN Input Button */}
        <button
          onClick={() => {
            // Stop camera before showing HN input
            if (videoRef.current?.srcObject) {
              const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
              tracks.forEach(track => track.stop());
              videoRef.current.srcObject = null;
            }
            setShowHNInput(true);
          }}
          className="px-6 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          กรอกหมายเลข HN เอง
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
            <p className="text-center mt-4">กำลังประมวลผล...</p>
          </div>
        </div>
      )}
    </div>
  );
}
