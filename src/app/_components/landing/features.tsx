import { motion } from 'framer-motion'
import { Clock, QrCode, Truck, BarChart } from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: "Atualizações em Tempo Real",
    description: "Atualize instantaneamente seus itens de menu, preços e disponibilidade em todas as plataformas."
  },
  {
    icon: QrCode,
    title: "QR Codes Personalizados",
    description: "Gere códigos QR únicos para cada mesa ou local, melhorando a experiência do cliente."
  },
  {
    icon: Truck,
    title: "Pedidos no Local e Delivery",
    description: "Permita que os clientes façam pedidos para consumo no local ou entrega diretamente do cardápio digital."
  },
  {
    icon: BarChart,
    title: "Análise de Vendas",
    description: "Obtenha insights valiosos sobre o desempenho do seu menu e preferências dos clientes."
  }
]

export default function Features() {
  return (
    <section id="recursos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Recursos Poderosos para Seu Restaurante</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <feature.icon className="w-12 h-12 text-red-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}