import { motion } from 'framer-motion'
import Image from 'next/image'

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
    description: "Publique seu cardápio digital e comece a aceitar pedidos."
  }
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Como o Restaurox Funciona</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image src="/placeholder.svg" alt="Como o Restaurox Funciona" width={500} height={500} className="rounded-lg shadow-xl" />
          </motion.div>
          <div className="md:w-1/2 md:pl-12">
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