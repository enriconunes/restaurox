// components/ItemCard.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Item } from '../types'
import { Leaf, XCircle } from 'lucide-react'
import { EditItemButton } from './edit-item-modal'

interface ItemCardProps {
  item: Item
  onUpdate: (updatedItem: Item) => void
  onDelete: (id: string) => Promise<void> // Modificado para retornar uma Promise
}

export function ItemCard({ item, onUpdate, onDelete }: ItemCardProps) {
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2)}`
  }

  const isDiscountValid = (discount: Item['discount']) => {
    if (!discount || discount.expiration === null) return false
    const expirationDate = new Date(discount.expiration)
    return expirationDate > new Date()
  }

  // Função wrapper para chamar onDelete com o ID do item
  const handleDelete = () => onDelete(item.id)

  return (
    <Card className='mt-2'>
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-16 h-32 sm:h-16 flex-shrink-0">
          <img
            src={item.imageUrl || "https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg"}
            alt={item.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex-grow space-y-2 sm:space-y-1 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold">{item.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
              {item.isVegan && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Leaf className="h-3 w-3 mr-1" />
                  Vegano
                </Badge>
              )}
              {!item.isAvailable && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <XCircle className="h-3 w-3 mr-1" />
                  Indisponível
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <div className="flex items-center justify-between">
            <div className="space-x-2">
              {item.discount && isDiscountValid(item.discount) ? (
                <>
                  <span className="text-sm line-through text-muted-foreground">{formatPrice(parseFloat(item.price))}</span>
                  <span className="text-sm font-medium text-red-600">{formatPrice(parseFloat(item.discount.newPrice))}</span>
                </>
              ) : (
                <span className="text-sm font-medium">{formatPrice(parseFloat(item.price))}</span>
              )}
            </div>
            <EditItemButton 
              item={item}
              onSave={onUpdate}
              onDelete={handleDelete}
            />
          </div>
          {item.discount?.expiration && new Date(item.discount.expiration).getTime() !== new Date('9999-12-31T23:59:59.999Z').getTime() && (
            <p className="text-xs text-muted-foreground">
              Válido até {new Date(item.discount.expiration).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}