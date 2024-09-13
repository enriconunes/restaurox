import { motion } from 'framer-motion'
import { Phone, Mail, Clock } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contato" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Entre em Contato</h2>
          <p className="text-lg md:text-xl text-gray-600">Estamos aqui para ajudar! Como podemos tornar sua experiência com o Restaurox ainda melhor?</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 md:p-8 rounded-lg shadow-md"
          >
            <Phone className="w-10 h-10 md:w-12 md:h-12 text-red-700 mb-4 mx-auto" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Ligue para Nós</h3>
            <p className="text-gray-600 mb-4">Nossa equipe está pronta para atendê-lo</p>
            <a href="tel:+5573999284484" className="text-red-700 hover:text-red-800 transition-colors font-semibold">
              (73) 9 9928-4484
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 md:p-8 rounded-lg shadow-md"
          >
            <Mail className="w-10 h-10 md:w-12 md:h-12 text-red-700 mb-4 mx-auto" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Envie um E-mail</h3>
            <p className="text-gray-600 mb-4">Responderemos o mais rápido possível</p>
            <a href="mailto:suportpitangastudio@gmail.com" className="text-red-700 hover:text-red-800 transition-colors font-semibold break-all">
              suportpitangastudio@gmail.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 md:p-8 rounded-lg shadow-md"
          >
            <Clock className="w-10 h-10 md:w-12 md:h-12 text-red-700 mb-4 mx-auto" />
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Horário de Atendimento</h3>
            <p className="text-gray-600 mb-2">Segunda a Sexta</p>
            <p className="text-red-700 font-semibold">09:00 - 18:00</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 md:mt-12 text-center"
        >
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Seja para vendas, dúvidas técnicas ou qualquer outra informação, nossa equipe está pronta para ajudar!
          </p>
        </motion.div>
      </div>
    </section>
  )
}