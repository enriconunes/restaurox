'use client'

import { motion } from 'framer-motion'
import ComputerMockup from './computer-mockup'

const steps = [
  {
    title: "Cadastre-se",
    description: "Crie sua conta gratuita e configure o perfil do seu restaurante."
  },
  {
    title: "Crie Seu Cardápio",
    description: "Adicione seus itens de menu, categorias e personalize o layout."
  },
  {
    title: "Gere QR Codes",
    description: "Crie códigos QR únicos para suas mesas ou locais."
  },
  {
    title: "Comece a Usar",
    description: "O seu cardápio já estará pronto para alavancar suas vendas."
  }
]

export default function HowItWorks() {
  const images = [
    '/print-pc-01.png',
    '/print-pc-02.png',
    '/print-pc-03.png',
    '/print-pc-04.png'
  ]

  return (
    <section id="como-funciona" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Como o Restaurox Funciona</h2>
        <div className="flex flex-col items-center justify-between">
          <motion.div 
            className="w-full mb-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ComputerMockup images={images} />
          </motion.div>
          <div className="w-full">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="mb-8 flex items-start"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}