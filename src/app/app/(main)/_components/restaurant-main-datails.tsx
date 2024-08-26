import Link from 'next/link'
import { Edit, Phone, Instagram, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RestaurantMainDetails() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-background text-foreground rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center p-4 sm:p-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
            <img
              src="https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg"
              alt="Logotipo da Pizzaria Lenha na Brasa"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">Pizzaria Lenha na Brasa</h1>
            <p className="text-muted-foreground text-sm mb-2">Rua das Andorinhas nº 24, Mirante Caravelas</p>
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-red-700 hover:bg-red-800 text-white border-red-600">
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-muted p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm mb-2">
            <div className="flex items-center mb-2 sm:mb-0">
              <Phone className="h-4 w-4 mr-2 text-red-700" />
              <span>73988909876</span>
            </div>
            <div className="flex items-center">
              <Instagram className="h-4 w-4 mr-2 text-red-700" />
              <span>_lenhanabrasa_</span>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground">
            <Truck className="h-4 w-4 mr-2 text-red-700" />
            <span>Delivery disponível</span>
          </div>
        </div>
      </div>
    </div>
  )
}