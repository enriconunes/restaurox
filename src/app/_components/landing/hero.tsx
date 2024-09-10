import { motion } from 'framer-motion'
import PhoneMockup from './mockup'

export default function Hero() {
  const images = ['/print-01.PNG', '/print-02.PNG']
  const titles = ['Cardápio visto pelos clientes', 'Painel de gerenciamento do restaurante']

  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <motion.div 
          className="md:w-1/2 mb-10 md:mb-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Revolucione o Gerenciamento de Cardápios do Seu Restaurante</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">Crie e gerencie cardápios digitais personalizados com atualizações em tempo real, integração de QR code e análises poderosas.</p>
          <motion.a 
            href="/app" 
            className="bg-red-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-800 transition-colors inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Comece Gratuitamente
          </motion.a>
        </motion.div>
        <motion.div 
          className="md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PhoneMockup images={images} titles={titles} />
        </motion.div>
      </div>
    </section>
  )
}