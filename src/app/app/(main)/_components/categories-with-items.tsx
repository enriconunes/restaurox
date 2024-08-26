'use client'

import { useState } from 'react'
import { Pencil, Trash2, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function CategoriesWithItems() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Bebidas',
      isEditing: false,
      items: [
        {
          id: 1,
          name: 'Coca-cola',
          description: 'Coca cola lata 30cl',
          image: 'https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg'
        }
      ]
    },
    {
      id: 2,
      name: 'Pizzas',
      isEditing: false,
      items: [
        {
          id: 2,
          name: 'Margherita',
          description: 'Molho de tomate, mozzarella e manjericão',
          image: 'https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg'
        }
      ]
    }
  ])

  const handleEdit = (categoryId: number) => {
    setCategories(categories.map(category => 
      category.id === categoryId ? { ...category, isEditing: true } : category
    ))
  }

  const handleSave = (categoryId: number) => {
    setCategories(categories.map(category => 
      category.id === categoryId ? { ...category, isEditing: false } : category
    ))
  }

  const handleDelete = (categoryId: number) => {
    console.log('Category deleted:', categories.find(c => c.id === categoryId)?.name)
  }

  const handleNameChange = (categoryId: number, newName: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId ? { ...category, name: newName } : category
    ))
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      {categories.map((category, index) => (
        <Card key={category.id} className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {category.isEditing ? (
              <Input
                value={category.name}
                onChange={(e) => handleNameChange(category.id, e.target.value)}
                className="font-semibold text-lg"
              />
            ) : (
              <CardTitle>{category.name}</CardTitle>
            )}
            <div className="flex space-x-2">
              {category.isEditing ? (
                <>
                  <Button size="icon" variant="ghost" onClick={() => handleSave(category.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4 text-red-700" />
                  </Button>
                </>
              ) : (
                <Button size="icon" variant="ghost" onClick={() => handleEdit(category.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 mb-4 hover:bg-muted"
            >
              <Plus className="h-4 w-4 mr-2" /> Adicionar novo item
            </Button>
            {category.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Button size="icon" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
          {/* {index < categories.length - 1 && <Separator className="my-4" />} */}
        </Card>
      ))}
    </div>
  )
}