'use client'

import React from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full -z-10" />
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <Image
                  src="/logo.webp"
                  alt="Logo"
                  fill
                  className="object-contain p-1 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
                  priority
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
                ระบบยืนยันตัวตนผู้ป่วย
              </h1>
              <p className="text-blue-600 text-lg">
                โรงพยาบาลคนไข้พร้อมไหม
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full -z-10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/doctor.jpg"
                alt="Doctor Icon"
                fill
                className="object-cover rounded-full p-1 bg-white/90 backdrop-blur-sm shadow-lg"
                priority
              />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            ยินดีต้อนรับสู่ระบบยืนยันตัวตน
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            เพื่อความสะดวกและรวดเร็วในการเข้ารับบริการ 
            กรุณายืนยันตัวตนด้วยการถ่ายภาพใบหน้าของท่าน
          </p>

          <div className="space-y-6">
            <button
              onClick={() => router.push('/scan')}
              className="
                bg-blue-600 text-white px-10 py-5 rounded-2xl

                text-xl font-medium shadow-lg
                transition duration-300 transform
                hover:bg-blue-700 hover:shadow-xl hover:scale-105
                focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50
                flex items-center justify-center gap-3 mx-auto
                group
              "
            >
              <CameraIcon className="w-8 h-8 group-hover:animate-pulse" />
              <span>เริ่มการยืนยันตัวตน</span>
            </button>

            <p className="text-base text-gray-500">
              <InfoIcon className="w-5 h-5 inline mr-2 text-blue-500" />
              ระบบจะขอเข้าถึงกล้องของอุปกรณ์เพื่อถ่ายภาพยืนยันตัวตน
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16 border-t">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
          <p className="text-center text-gray-600">
            © 2024 โรงพยาบาลคนไข้พร้อมไหม. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Icons
const CameraIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const InfoIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
