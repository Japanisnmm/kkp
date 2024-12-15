'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'

interface Appointment {
  id: string
  date: string
  department_name: string
}

interface Patient {
  id: number
  image: string
  name: string
  surname: string
  hn: number
  age: number
  gender: string
  right: string
  Appointment_Date: boolean
  appointments: Appointment[]
}

interface ApiResponse {
  patients: Patient[]
}

const PatientCard = ({ 
  patient, 
  onConfirm, 
  onBack 
}: { 
  patient: Patient
  onConfirm: () => void
  onBack: () => void
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
    <div className="flex flex-col items-center text-center mb-6">
      <div className="relative w-40 h-40 mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full -z-10" />
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <Image
            src={`/${patient.image}`}
            alt={`${patient.name}'s photo`}
            fill
            className="object-cover rounded-full border-4 border-white"
            priority
          />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-blue-900 mb-2">
        {patient.name} {patient.surname}
      </h2>
      <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
        HN: {patient.hn}
      </span>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-blue-800 mb-4">ข้อมูลผู้ป่วย</h3>
        <InfoItem label="HN" value={patient.hn} />
        <InfoItem label="อายุ" value={`${patient.age} ปี`} />
        <InfoItem label="เพศ" value={patient.gender} />
        <InfoItem 
          label="สิทธิ์การรักษา" 
          value={patient.right}
          className="text-green-600"
        />
      </div>
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          นัดหมาย
        </h3>
        <div className="space-y-3">
          {patient.appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="p-4 bg-white rounded-lg border border-blue-100"
            >
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-blue-500" />
                <span className="font-medium">วันที่:</span> {appointment.date}
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-2 mt-2">
                <BuildingIcon className="w-4 h-4 text-blue-500" />
                <span className="font-medium">แผนก:</span> {appointment.department_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-6 flex flex-row justify-center gap-4 w-full px-4 sm:px-0">
      <button
        onClick={onBack}
        className="flex-1 sm:flex-initial bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg
                 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm whitespace-nowrap"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        ย้อนกลับ
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 sm:flex-initial bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg
                 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm whitespace-nowrap"
      >
        <CheckIcon className="w-5 h-5" />
        ยืนยันตัวตน
      </button>
    </div>
  </div>
)

const InfoItem = ({ 
  label, 
  value, 
  className = "" 
}: { 
  label: string
  value: string | number
  className?: string 
}) => (
  <p className={`text-gray-700 flex items-center gap-2 ${className}`}>
    <span className="font-medium min-w-[120px]">{label}:</span> 
    <span>{value}</span>
  </p>
)

// Simple icon components
const CalendarIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ClockIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const BuildingIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

export default function AboutProfile() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const hn = searchParams.get('hn')
    if (hn) {
      fetchPatients(hn)
    }
  }, [searchParams])

  const fetchPatients = async (hn: string) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('Fetching data for HN:', hn)

      const formData = new FormData()
      formData.append('hn', hn)

      const response = await fetch('https://kkp-s.stewlab.win/recognize', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const data = await response.json()
      console.log('Received data:', data)

      if (data.patients && data.patients.length > 0) {
        setPatients(data.patients)
      } else {
        setError('ไม่พบข้อมูลผู้ป่วย')
      }
      
    } catch (error) {
      console.error('Error fetching patients:', error)
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setIsLoading(false)
    }
  }

  console.log('Current patients state:', patients)
  console.log('Current loading state:', isLoading)
  console.log('Current error state:', error)

  const handleConfirm = () => {
    router.push('/scan/aboutprofile/prescreen')
  }

  const handleBack = () => {
    router.push('/scan')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header with improved shadow and spacing */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 relative shrink-0">
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
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
                ระบบยืนยันตัวตนผู้ป่วย
              </h1>
              <p className="text-blue-600 text-lg font-medium">
                โรงพยาบาลคนไข้พร้อมไหม
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with improved spacing and animations */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-500 mx-auto" />
            <p className="mt-6 text-lg text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl mb-6 border border-red-200 shadow-sm
                        flex items-center gap-4 animate-fade-in">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Patient Cards */}
        {!isLoading && patients.map((patient) => (
          <div key={patient.id} className="transform transition-all duration-300 hover:scale-[1.01]">
            <PatientCard 
              patient={patient}
              onConfirm={handleConfirm}
              onBack={handleBack}
            />
          </div>
        ))}

        {/* No Data State */}
        {!isLoading && patients.length === 0 && !error && (
          <div className="text-center text-gray-500 py-16 bg-white rounded-xl border shadow-sm animate-fade-in">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium">ไม่พบข้อมูลผู้ป่วย</p>
          </div>
        )}
      </main>
    </div>
  )
}

const RefreshIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const AlertIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

const CheckIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const HospitalIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const ArrowLeftIcon = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)
