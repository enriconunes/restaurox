import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'

type PhoneMockupProps = {
  images: string[]
  titles: string[]
}

export default function PhoneMockup({ images, titles }: PhoneMockupProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  return (
    <div className="relative mx-auto w-[300px] h-[600px] bg-black rounded-[40px] shadow-xl overflow-hidden border-[14px] border-black">
      <div className="absolute top-0 inset-x-0 h-[32px] bg-black rounded-b-[20px]"></div>
      <div className="absolute top-0 inset-x-0 w-[150px] h-[30px] mx-auto bg-black rounded-b-[20px] flex items-center justify-center">
        <div className="w-[60px] h-[6px] bg-gray-800 rounded-full"></div>
      </div>
      <motion.div 
        className="relative h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={images[currentIndex]}
          alt={titles[currentIndex]}
          layout="fill"
          objectFit="cover"
        />
      </motion.div>
      <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
        onClick={nextImage}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}