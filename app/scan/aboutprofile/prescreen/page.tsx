'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Question {
  id: number
  text: string
  answer: string | null
}

export default function Prescreen() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "คุณมีไข้ใหม่ตั้งแต่ 37 องศาขึ้นไปหรือไม่?", answer: null },
    { id: 2, text: "คุณมีอาการไอใหม่ที่ไม่เกี่ยวข้องกับโรคประจำตัวหรือไม่?", answer: null },
    { id: 3, text: "คุณมีอาการหายใจลำบากหรือหายใจถี่ใหม่หรือไม่?", answer: null },
    { id: 4, text: "คุณมีอาการเจ็บคอใหม่หรือไม่?", answer: null },
    { id: 5, text: "คุณมีอาการท้องเสียใหม่ในช่วง 48 ชั่วโมงที่ผ่านมาหรือไม่?", answer: null },
    { id: 6, text: "คุณสูญเสียการรับรู้กลิ่นหรือรสชาติในช่วงไม่กี่วันที่ผ่านมาหรือไม่?", answer: null },
    { id: 7, text: "คุณมีอาการปวดเมื่อยตามตัว อ่อนเพลีย และปวดหัวร่วมกันในช่วง 48 ชั่วโมงที่ผ่านมาหรือไม่?", answer: null },
    { id: 8, text: "คุณได้รับการวินิจฉัยว่าเป็นโควิด-19 ในช่วง 14 วันที่ผ่านมาหรือไม่?", answer: null },
    { id: 9, text: "คุณมีอาการรุนแรงหรือไม่?", answer: null },
    { id: 10, text: "คุณมีอาการเหล่านี้ในช่วง 24 ชั่วโมงที่ผ่านมาหรือไม่?", answer: null }
  ])

  const handleAnswer = (questionId: number, answer: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, answer } : q
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert answers to 1/0 format
    const formattedAnswers = questions.map(q => ({
      questionId: q.id,
      answer: q.answer === 'Yes' ? 1 : 0
    }))

    console.log('Formatted Answers:', formattedAnswers)

    // Add your API call here
    try {
      // Example API call
      // const response = await fetch('your-api-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ answers: formattedAnswers })
      // })

      // if (response.ok) {
      //   router.push('/next-page')
      // }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full -z-10" />
              <div className="absolute inset-0 flex items-center justify-center">
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
                แบบคัดกรองอาการเบื้องต้น
              </h1>
              <p className="text-blue-600 text-lg">
                โรงพยาบาลคนไข้พร้อมไหม
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question) => (
            <div 
              key={question.id} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
            >
              <p className="text-lg text-gray-800 mb-4">{question.text}</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleAnswer(question.id, 'Yes')}
                  className={`
                    flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200
                    ${question.answer === 'Yes'
                      ? 'border-red-500 bg-red-50 text-red-700 font-medium'
                      : 'border-gray-300 hover:border-red-300 hover:bg-red-50/50'
                    }
                  `}
                >
                  ใช่
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer(question.id, 'No')}
                  className={`
                    flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200
                    ${question.answer === 'No'
                      ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                      : 'border-gray-300 hover:border-green-300 hover:bg-green-50/50'
                    }
                  `}
                >
                  ไม่ใช่
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={questions.some(q => q.answer === null)}
              className={`
                px-8 py-3 rounded-lg text-white font-medium transition-all duration-200
                ${questions.some(q => q.answer === null)
                  ? 'bg-gray-400 cursor-not-allowed opacity-75'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
                }
              `}
            >
              ส่งคำตอบ
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}