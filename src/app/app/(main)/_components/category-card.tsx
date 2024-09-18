// components/CategoryCard.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ItemCategory, Item } from '../types'
import { Pencil, Check, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import AddNewItemModal from './add-new-item-modal'
import { ItemCard } from './item-card'

interface CategoryCardProps {
  category: ItemCategory
  onEdit: (categoryId: string, newName: string) => void
  onDelete: (categoryId: string) => void
  onAddItem: (categoryId: string, newItem: Item) => void
  onUpdateItem: (categoryId: string, updatedItem: Item) => void
  onDeleteItem: (categoryId: string, itemId: string) => Promise<void> // Modificado para retornar uma Promise
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}: CategoryCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(category.name)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSave = () => {
    onEdit(category.id, newName)
    setIsEditing(false)
  }

  return (
    <Card className="bg-background text-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="font-semibold text-lg"
            />
          ) : (
            <CardTitle>{category.name}</CardTitle>
          )}
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button size="icon" variant="ghost" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(category.id)}>
                <Trash2 className="h-4 w-4 text-red-700" />
              </Button>
            </>
          ) : (
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <AddNewItemModal 
          categoryId={category.id} 
          onAddItem={(newItem: Item) => onAddItem(category.id, newItem)} 
        />
        {(category.items || []).slice(0, isExpanded ? undefined : 3).map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onUpdate={(updatedItem) => onUpdateItem(category.id, updatedItem)}
            onDelete={() => onDeleteItem(category.id, item.id)}
          />
        ))}
      </CardContent>
      {category.items.length > 3 && (
        <CardFooter>
          <Button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full"
            variant="outline"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Ver todos os {category.items.length} itens
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}