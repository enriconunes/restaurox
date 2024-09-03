'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputUploadThingItem } from './input-upload-thing-item'
import { useUploadThing } from '@/utils/uploadthing'
import { toast } from '@/components/ui/use-toast'
import { Item } from '../types'

import { createNewItem } from '../actions'

const newItemSchema = z.object({
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

type NewItemFormValues = z.infer<typeof newItemSchema>

interface AddNewItemModalProps {
  categoryId: string;
  onAddItem: (item: Item) => void;
}

export default function AddNewItemModal({ categoryId, onAddItem }: AddNewItemModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { startUpload, isUploading } = useUploadThing("imageUploader")

  const form = useForm<NewItemFormValues>({
    resolver: zodResolver(newItemSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      isVegan: false,
      isAvailable: true,
      imageUrl: '',
    },
  })

  const handleSubmit = async (values: NewItemFormValues) => {
    try {
      let newImageUrl = values.imageUrl

      if (selectedFile) {
        const uploadResult = await startUpload([selectedFile])
        if (uploadResult && uploadResult[0]) {
          newImageUrl = uploadResult[0].url
        } else {
          throw new Error("Failed to upload image")
        }
      }

      const newItemData: Item = {
        ...values,
        id: Date.now().toString(),
        price: parseFloat(values.price).toFixed(2), // Ensure two decimal places
        imageUrl: newImageUrl || "https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg",
        categoryId: categoryId,
      }

      const result = await createNewItem(newItemData)

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.data) {
        onAddItem(result.data)
        setIsOpen(false)
        form.reset()
        setSelectedFile(null)

        toast({
          title: 'Sucesso',
          description: 'Novo item adicionado com sucesso.',
        })
      } else {
        throw new Error("Falha ao criar novo item. Por favor, tente novamente.")
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao adicionar o novo item: ' + error,
        variant: 'destructive',
      })
      console.error('Erro ao adicionar novo item:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-2 mb-4 hover:bg-muted">
          <Plus className="h-4 w-4 mr-2" /> Adicionar novo item dessa categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Item</DialogTitle>
        </DialogHeader>
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
                        <Input placeholder="Digite o nome do item" {...field} />
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
                          placeholder="Digite o preço"
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
                      placeholder="Digite a descrição"
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
            <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white" disabled={isUploading}>
              {isUploading ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}