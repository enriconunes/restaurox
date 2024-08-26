'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function AddNewCategory() {
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