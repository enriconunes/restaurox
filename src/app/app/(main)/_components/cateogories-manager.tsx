'use client'

import { useState } from 'react'
import { RestaurantData, Item, ItemCategory } from '../types'
import { upsertCategory, deleteCategory, updateItem, deleteItemById } from '../actions'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { AddCategoryForm } from './add-category-form'
import { CategoryCard } from './category-card'
import { UtensilsCrossed } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

interface CategoriesManagerProps {
  initialData: RestaurantData | null
}

export default function CategoriesManager({ initialData }: CategoriesManagerProps) {
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(initialData)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleAddCategory = (newCategory: ItemCategory) => {
    setRestaurantData(prevData => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        itemCategories: [...prevData.itemCategories, {...newCategory, items: newCategory.items || []}] as ItemCategory[]
      };
    });
  }

  const handleEditCategory = async (categoryId: string, newName: string) => {
    try {
      await upsertCategory({ id: categoryId, name: newName, restaurantId: restaurantData?.id })
      toast({
        title: 'Sucesso',
        description: 'O nome da categoria foi atualizado com sucesso.',
      })

      setRestaurantData(prevData => {
        if (!prevData) return prevData
        return {
          ...prevData,
          itemCategories: prevData.itemCategories.map(category => 
            category.id === categoryId ? { ...category, name: newName } : category
          )
        }
      })
      router.refresh()
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar nome da categoria. Por favor, tente novamente.',
      })
    }
  }

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      setIsDeleting(true)
      try {
        const result = await deleteCategory(categoryToDelete)
        if (result.error) {
          toast({
            title: 'Erro',
            description: result.error,
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Sucesso',
            description: 'A categoria foi deletada com sucesso.',
          })
          setRestaurantData(prevData => {
            if (!prevData) return prevData
            return {
              ...prevData,
              itemCategories: prevData.itemCategories.filter(category => category.id !== categoryToDelete)
            }
          })
          router.refresh()
        }
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Houve um erro ao deletar a categoria. Por favor, tente novamente.',
          variant: 'destructive',
        })
      } finally {
        setIsDeleting(false)
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
      }
    }
  }

  const handleAddItem = (categoryId: string, newItem: Item) => {
    setRestaurantData(prevData => {
      if (!prevData) return prevData
      return {
        ...prevData,
        itemCategories: prevData.itemCategories.map(category => 
          category.id === categoryId
            ? { ...category, items: [...category.items, newItem] }
            : category
        )
      }
    })
    router.refresh()
  }

  const handleUpdateItem = async (categoryId: string, updatedItem: Item) => {
    try {
      await updateItem(updatedItem)
      setRestaurantData(prevData => {
        if (!prevData) return prevData
        return {
          ...prevData,
          itemCategories: prevData.itemCategories.map(category => 
            category.id === categoryId
              ? { ...category, items: category.items.map(item => item.id === updatedItem.id ? updatedItem : item) }
              : category
          )
        }
      })
      router.refresh()
      toast({
        title: 'Sucesso',
        description: 'Item atualizado com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o item.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteItem = async (categoryId: string, itemId: string): Promise<void> => {
    try {
      const result = await deleteItemById(itemId)

      if (result.error) {
        toast({
          title: 'Erro',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        setRestaurantData(prevData => {
          if (!prevData) return prevData
          return {
            ...prevData,
            itemCategories: prevData.itemCategories.map(category => 
              category.id === categoryId
                ? { ...category, items: category.items.filter(item => item.id !== itemId) }
                : category
            )
          }
        })

        router.refresh()
        toast({
          title: 'Sucesso',
          description: 'Item excluído com sucesso.',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao excluir o item.',
        variant: 'destructive',
      })
      console.error('Erro ao excluir o item:', error)
    }
  }

  if (!restaurantData || restaurantData.itemCategories.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto lg:p-6 mt-4 lg:mt-0">
        <Card className="bg-background text-foreground">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
            <CardTitle className="text-xl mb-2">Seu cardápio ainda está vazio</CardTitle>
            <p className="text-muted-foreground mb-4">
              Comece adicionando uma nova categoria de alimentos para cadastrar os primeiros itens do seu cardápio.
            </p>
            <AddCategoryForm
              restaurantId={restaurantData?.id || ''}
              onCategoryAdded={handleAddCategory}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto lg:px-6 py-6 space-y-6">
      <div className="w-full max-w-3xl mx-auto lg:px-6 pt-6">
        <AddCategoryForm
          restaurantId={restaurantData.id}
          onCategoryAdded={handleAddCategory}
        />
      </div>

      {restaurantData.itemCategories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={handleEditCategory}
          onDelete={handleDeleteClick}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />
      ))}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar esta categoria? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deletando...' : 'Deletar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}