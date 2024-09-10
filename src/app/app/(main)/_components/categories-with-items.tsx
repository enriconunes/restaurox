'use client'

import { useState } from 'react'
import { Pencil, Trash2, Check, ChevronDown, ChevronUp, Leaf, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { RestaurantData, Item, ItemCategory } from '../types'
import AddNewItemModal from './add-new-item-modal'
import { deleteCategory, upsertCategory, updateItem, deleteItemById } from '../actions'
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
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

interface CategoriesWithItemsProps {
  data: RestaurantData | null
}

export default function CategoriesWithItems({ data }: CategoriesWithItemsProps) {
  const [categories, setCategories] = useState<(ItemCategory & { isEditing: boolean, isExpanded: boolean })[]>(
    data?.itemCategories.map((category) => ({
      ...category,
      isEditing: false,
      isExpanded: false,
    })) || []
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const router = useRouter()

  const deleteOldImage = async (fileUrl: string) => {
    const fileKey = fileUrl.split('/').pop();
    if (!fileKey) return;

    try {
      const response = await fetch('/api/uploadthing/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey }),
      });
      const result = await response.json();
      if (!result.success) {
        console.error('Failed to delete old image:', result.error);
      }
    } catch (error) {
      console.error('Error deleting old image:', error);
    }
  };

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
          title: 'Sucesso',
          description: 'O nome da categoria foi atualizado com sucesso.',
        })

        setCategories(categories.map(category => 
          category.id === categoryId ? { ...category, isEditing: false } : category
        ))
        router.refresh()
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Erro ao atualizar nome da categoria. Por favor, tente novamente.',
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
          setCategories(categories.filter(category => category.id !== categoryToDelete))
          router.refresh()
        }
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Houve um erro ao deletar a categoria. Por favor, tente novamente.',
          variant: 'destructive',
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
    router.refresh()
  }

  const handleUpdateItem = async (categoryId: string, updatedItem: Item) => {
    try {
      await updateItem(updatedItem)
      setCategories(categories.map(category => 
        category.id === categoryId
          ? { ...category, items: category.items.map(item => item.id === updatedItem.id ? updatedItem : item) }
          : category
      ))
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

  const handleDeleteItem = async (categoryId: string, itemId: string) => {
    try {
      // Find the item to be deleted
      const categoryToUpdate = categories.find(category => category.id === categoryId);
      const itemToDelete = categoryToUpdate?.items.find(item => item.id === itemId);

      if (itemToDelete && itemToDelete.imageUrl) {
        // Delete the image from UploadThing
        await deleteOldImage(itemToDelete.imageUrl);
      }

      // Delete the item from the database
      const result = await deleteItemById(itemId);

      if (result.error) {
        // If there's an error, show an error toast
        toast({
          title: 'Erro',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        // If deletion was successful, update the local state and show success toast
        setCategories(categories.map(category => 
          category.id === categoryId
            ? { ...category, items: category.items.filter(item => item.id !== itemId) }
            : category
        ));

        router.refresh();
        toast({
          title: 'Sucesso',
          description: 'Item excluído com sucesso.',
        });
      }
    } catch (error) {
      // Handle any unexpected errors
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao excluir o item.',
        variant: 'destructive',
      });
      console.error('Erro ao excluir o item:', error);
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setCategories(categories.map(category =>
      category.id === categoryId ? { ...category, isExpanded: !category.isExpanded } : category
    ))
  }

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2)}`
  }

  const isDiscountValid = (discount: Item['discount']) => {
    if (!discount || discount.expiration === null) return false;
    const expirationDate = new Date(discount.expiration);
    return expirationDate > new Date();
  }
  

  return (
    <div className="w-full max-w-3xl mx-auto lg:px-6 py-6 space-y-6">
      {categories.map((category) => (
        <Card key={category.id} className="bg-background text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              {category.isEditing ? (
                <Input
                  value={category.name}
                  onChange={(e) => handleNameChange(category.id, e.target.value)}
                  className="font-semibold text-lg"
                />
              ) : (
                <CardTitle>{category.name}</CardTitle>
              )}
            </div>
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
            {category.items.slice(0, category.isExpanded ? undefined : 3).map((item) => (
              <Card className='mt-2' key={item.id}>
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
                        onSave={(updatedItem: Item) => handleUpdateItem(category.id, updatedItem)} 
                        onDelete={() => handleDeleteItem(category.id, item.id)} 
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
            ))}
          </CardContent>
          {category.items.length > 3 && (
            <CardFooter>
              <Button 
                onClick={() => toggleCategoryExpansion(category.id)}
                className="w-full"
                variant="outline"
              >
                {category.isExpanded ? (
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