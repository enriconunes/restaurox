import { motion } from 'framer-motion'
import Image from 'next/image'

const testimonials = [
  {
    name: "João Silva",
    role: "Proprietário de Restaurante",
    content: "O Restaurox transformou completamente a forma como gerenciamos nosso cardápio. As atualizações em tempo real e a integração com QR code melhoraram significativamente a experiência dos nossos clientes.",
    image: "/placeholder.svg"
  },
  {
    name: "Maria Santos",
    role: "Gerente de Cafeteria",
    content: "As análises fornecidas pelo Restaurox nos deram insights valiosos sobre o desempenho do nosso menu. Conseguimos otimizar nossas ofertas e aumentar nossas vendas.",
    image: "/placeholder.svg"
  },
  {
    name: "Carlos Oliveira",
    role: "Proprietário de Food Truck",
    content: "Como proprietário de food truck, a flexibilidade do Restaurox é perfeita para o meu negócio. Posso atualizar facilmente meu menu em movimento e gerenciar pedidos de forma eficiente.",
    image: "/placeholder.svg"
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">O Que Nossos Clientes Dizem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <p className="text-gray-600 mb-4">{testimonial.content}</p>
              <div className="flex items-center">
                <Image src={testimonial.image} alt={testimonial.name} width={50} height={50} className="rounded-full mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}