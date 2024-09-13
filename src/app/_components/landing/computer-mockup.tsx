'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type ComputerMockupProps = {
  images: string[]
}

export default function ComputerMockup({ images }: ComputerMockupProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 7000)

    return () => clearInterval(timer)
  }, [images.length])

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-t-xl p-2 flex items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
      <div className="bg-white border-4 border-gray-800 aspect-video relative overflow-hidden">
        <Image
          src={images[currentIndex]}
          alt={`Screenshot ${currentIndex + 1}`}
          layout="fill"
          objectFit="contain"
        />
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 transition-opacity opacity-50 hover:opacity-100 focus:opacity-100"
          onClick={prevImage}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 transition-opacity opacity-50 hover:opacity-100 focus:opacity-100"
          onClick={nextImage}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="bg-gray-800 rounded-b-xl h-4"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-4 bg-gray-800 rounded-b-xl"></div>
    </div>
  )
}