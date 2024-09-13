import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  {
    name: "Básico",
    price: "Grátis",
    features: [
      "Criação de cardápio digital",
      "Geração de QR code",
      "Atualizações em tempo real",
    ]
  },
  {
    name: "Pro",
    price: "R$59,90/mês",
    features: [
      "Todos os recursos do plano Básico",
      "Pedidos para consumo local e para delivery",
      "Personalização de marca",
      "Análises de vendas avançadas",
      "Suporte prioritário"
    ]
  },
  {
    name: "Empresarial",
    price: "Personalizado",
    features: [
      "Todos os recursos do plano Pro",
      "Suporte para múltiplas unidades",
      "Integrações personalizadas"
    ]
  }
]

export default function Pricing() {
  return (
    <section id="precos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Preços Simples e Transparentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold text-red-700 mb-6">{plan.price}</p>
              <ul className="mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center mb-2">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.a 
                href="/app" 
                className="block w-full text-center bg-red-700 text-white px-6 py-3 rounded-full hover:bg-red-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Começar
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}