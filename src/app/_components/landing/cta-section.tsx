import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-20 bg-red-700">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pronto para Revolucionar o Cardápio do Seu Restaurante?
        </motion.h2>
        <motion.p 
          className="text-xl text-white mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Junte-se a milhares de restaurantes que já estão usando o Restaurox para otimizar suas operações e melhorar a experiência do cliente.
        </motion.p>
        <motion.a 
          href="/app" 
          className="inline-block bg-white text-red-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Comece Seu Teste Gratuito
        </motion.a>
      </div>
    </section>
  )
}