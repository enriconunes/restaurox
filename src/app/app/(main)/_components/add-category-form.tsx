// components/AddCategoryForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { upsertCategorySchema } from '../schema'
import { upsertCategory } from '../actions'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { ItemCategory } from '../types'

interface AddCategoryFormProps {
  restaurantId: string
  onCategoryAdded: (newCategory: ItemCategory) => void
}

export function AddCategoryForm({ restaurantId, onCategoryAdded }: AddCategoryFormProps) {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(upsertCategorySchema),
    defaultValues: {
      name: '',
      restaurantId: restaurantId,
    },
  })

  const onSubmit = form.handleSubmit(async (formData) => {
    setIsLoading(true)
    try {
      const newCategory = await upsertCategory(formData) as ItemCategory
      toast({
        title: 'Sucesso',
        description: 'Categoria adicionada com sucesso.',
      })
      setIsFormVisible(false)
      form.reset()
      onCategoryAdded(newCategory)
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Falha ao adicionar categoria. Por favor, tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <Card className="bg-background text-foreground">
      <CardContent className="p-0">
        <Button
          onClick={() => setIsFormVisible(!isFormVisible)}
          variant="ghost"
          className="w-full justify-between p-4 rounded-t-lg hover:bg-muted"
        >
          <span className="font-semibold">Adicionar nova categoria</span>
          <Plus className={`h-5 w-5 transition-transform ${isFormVisible ? 'rotate-45' : ''}`} aria-hidden="true" />
        </Button>

        {isFormVisible && (
          <form onSubmit={onSubmit} className="p-4 border-t border-border">
            <Input
              type="text"
              placeholder="Digite o nome da categoria"
              {...form.register('name')}
              className="mb-4"
              aria-label="Nome da categoria"
            />
            <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white" disabled={isLoading}>
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}