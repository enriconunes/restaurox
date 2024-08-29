'use client'

import { useState } from 'react'
import { Pencil, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RestaurantData, Item, ItemCategory } from '../types'
import AddNewItemModal from './add-new-item-modal'
import { deleteCategory, upsertCategory, updateItem } from '../actions'
import { toast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EditItemButton } from './edit-item-modal'

interface CategoriesWithItemsProps {
  data: RestaurantData | null
}

export default function CategoriesWithItems({ data }: CategoriesWithItemsProps) {
  const [categories, setCategories] = useState<ItemCategory[]>(
    data?.itemCategories.map((category) => ({
      ...category,
      isEditing: false,
    })) || []
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  const handleEdit = (categoryId: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId ? { ...category, isEditing: true } : category
    ))
  }

  const handleSave = async (categoryId: string) => {
    const categoryToUpdate = categories.find(category => category.id === categoryId)
    
    if (categoryToUpdate) {
      try {
        await upsertCategory({ id: categoryId, name: categoryToUpdate.name, restaurantId: data?.id })
        toast({
          title: 'Success',
          description: 'Category name has been updated successfully.',
        })

        setCategories(categories.map(category => 
          category.id === categoryId ? { ...category, isEditing: false } : category
        ))
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update category name. Please try again.',
        })
      }
    }
  }

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete)
        toast({
          title: 'Sucesso',
          description: 'A categoria foi deletada com sucesso.',
        })

        setCategories(categories.filter(category => category.id !== categoryToDelete))
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Houve um erro ao deletar a categoria. Por favor, tente novamente.',
        })
      }
    }
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }

  const handleNameChange = (categoryId: string, newName: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId ? { ...category, name: newName } : category
    ))
  }

  const handleAddItem = (categoryId: string, newItem: Item) => {
    setCategories(categories.map(category => 
      category.id === categoryId
        ? { ...category, items: [...category.items, newItem] }
        : category
    ))
  }

  const handleUpdateItem = async (categoryId: string, updatedItem: Item) => {
    try {
      await updateItem(updatedItem)
      setCategories(categories.map(category => 
        category.id === categoryId
          ? { ...category, items: category.items.map(item => item.id === updatedItem.id ? updatedItem : item) }
          : category
      ))
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

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      {categories.map((category) => (
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
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(category.id)}>
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
            <AddNewItemModal 
              categoryId={category.id} 
              onAddItem={(newItem: Item) => handleAddItem(category.id, newItem)} 
            />
            {category.items.map((item) => (
              <Card className='mt-2' key={item.id}>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.imageUrl || "https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-sm font-medium">R$ {item.price}</p>
                  </div>
                  <EditItemButton 
                    item={item}
                    onSave={(updatedItem: Item) => handleUpdateItem(category.id, updatedItem)} 
                  />
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
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
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}