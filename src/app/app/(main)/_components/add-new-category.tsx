'use client'

import { useState } from 'react'
import { Plus, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RestaurantData } from '@/app/types'

interface AddNewCategoryProps {
  data: RestaurantData | null;
}

export default function AddNewCategory({ data }: AddNewCategoryProps) {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [categoryName, setCategoryName] = useState('')

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the form submission
    console.log('Category added:', categoryName)
    setCategoryName('')
    setIsFormVisible(false)
  }

  const categories = data?.itemCategories || []

  if (categories.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6">
        <Card className="bg-background text-foreground">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">Seu cardápio ainda está vazio</CardTitle>
            <p className="text-muted-foreground mb-4">
              Comece adicionando uma nova categoria de alimentos para cadastrar os primeiros itens do seu cardápio.
            </p>
            <Button onClick={toggleForm} className="bg-red-700 hover:bg-red-800 text-white">
              <Plus className="h-4 w-4 mr-2" /> Adicionar nova categoria
            </Button>
            {isFormVisible && (
              <form onSubmit={handleSubmit} className="w-full mt-4">
                <Input
                  type="text"
                  placeholder="Digite o nome da categoria"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="mb-4"
                />
                <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white">
                  Adicionar
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <Card className="bg-background text-foreground">
        <CardContent className="p-0">
          <Button
            onClick={toggleForm}
            variant="ghost"
            className="w-full justify-between p-4 rounded-t-lg hover:bg-muted"
          >
            <span className="font-semibold">Adicionar nova categoria</span>
            <Plus className={`h-5 w-5 transition-transform ${isFormVisible ? 'rotate-45' : ''}`} />
          </Button>
          {isFormVisible && (
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <Input
                type="text"
                placeholder="Digite o nome da categoria"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mb-4"
              />
              <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white">
                Adicionar
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}