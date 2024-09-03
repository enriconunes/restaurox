'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { InputUploadThingItem } from './input-upload-thing-item'
import { useUploadThing } from '@/utils/uploadthing'
import { toast } from '@/components/ui/use-toast'
import { Item } from '../types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DiscountForm } from './discount-form'

const editItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().max(255, 'Descrição deve ter no máximo 255 caracteres'),
  price: z.string().refine(
    (value) => {
      const number = parseFloat(value);
      return !isNaN(number) && number >= 0 && /^\d+(\.\d{1,2})?$/.test(value);
    },
    {
      message: 'Preço deve ser um número positivo com no máximo duas casas decimais',
    }
  ),
  isVegan: z.boolean(),
  isAvailable: z.boolean(),
  imageUrl: z.string().optional(),
})

type EditItemFormValues = z.infer<typeof editItemSchema>

interface EditItemButtonProps {
  item: Item
  onSave: (updatedItem: Item) => void
  onDelete: (id: string) => Promise<void>
}

export function EditItemButton({ item, onSave, onDelete }: EditItemButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { startUpload, isUploading } = useUploadThing("imageUploader")
  const [activeTab, setActiveTab] = useState<'edit' | 'discount'>('edit')

  const form = useForm<EditItemFormValues>({
    resolver: zodResolver(editItemSchema),
    defaultValues: {
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      isVegan: item.isVegan,
      isAvailable: item.isAvailable,
      imageUrl: item.imageUrl,
    },
  })

  const handleSubmit = async (values: EditItemFormValues) => {
    try {
      let updatedItem = { ...item, ...values }

      if (selectedFile) {
        const uploadResult = await startUpload([selectedFile])
        if (uploadResult && uploadResult[0]) {
          updatedItem.imageUrl = uploadResult[0].url
        } else {
          throw new Error("Failed to upload image")
        }
      }

      await onSave(updatedItem)
      setIsOpen(false)
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
      console.error('Erro ao atualizar o item:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(item.id)
      setIsDeleteDialogOpen(false)
      toast({
        title: 'Sucesso',
        description: 'Item excluído com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o item.',
        variant: 'destructive',
      })
      console.error('Erro ao excluir o item:', error)
    }
  }

  return (
    <>
      <div className="flex space-x-2">
        <Button size="icon" variant="ghost" onClick={() => setIsOpen(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setIsDeleteDialogOpen(true)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          <div className="flex space-x-2 mb-4">
            <Button
              variant={activeTab === 'edit' ? 'default' : 'outline'}
              onClick={() => setActiveTab('edit')}
            >
              Editar
            </Button>
            <Button
              variant={activeTab === 'discount' ? 'default' : 'outline'}
              onClick={() => setActiveTab('discount')}
            >
              Desconto
            </Button>
          </div>
          {activeTab === 'edit' ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-1">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputUploadThingItem
                              currentImageUrl={field.value || ''}
                              onImageSelect={(file) => setSelectedFile(file)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="md:col-span-1 space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do item</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="decimal"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9.]/g, '');
                                const parts = value.split('.');
                                if (parts.length > 1) {
                                  parts[1] = parts[1].slice(0, 2);
                                }
                                field.onChange(parts.join('.'));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-sm text-muted-foreground text-right">
                        {field.value.length}/255
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <FormField
                    control={form.control}
                    name="isVegan"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Item vegano
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Está disponível
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white" disabled={isUploading}>
                    {isUploading ? 'Salvando...' : 'Salvar alterações'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <DiscountForm item={item} onSave={onSave} />
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o item "{item.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}