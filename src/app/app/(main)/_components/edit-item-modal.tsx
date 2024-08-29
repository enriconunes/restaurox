'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { InputUploadThingItem } from './input-upload-thing-item'
import { useUploadThing } from '@/utils/uploadthing'
import { toast } from '@/components/ui/use-toast'
import { Item } from '../types'

interface EditItemButtonProps {
  item: Item
  onSave: (updatedItem: Item) => void
}

export function EditItemButton({ item, onSave }: EditItemButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editedItem, setEditedItem] = useState(item)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { startUpload, isUploading } = useUploadThing("imageUploader")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedItem(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditedItem(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let updatedItem = { ...editedItem }

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

  return (
    <>
      <Button size="icon" variant="ghost" onClick={() => setIsOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <InputUploadThingItem
                  currentImageUrl={editedItem.imageUrl}
                  onImageSelect={(file) => setSelectedFile(file)}
                />
              </div>
              <div className="md:col-span-1 space-y-4">
                <div>
                  <Label htmlFor="name">Nome do item</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editedItem.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    name="price"
                    value={editedItem.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={editedItem.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVegan"
                  checked={editedItem.isVegan}
                  onCheckedChange={(checked) => handleCheckboxChange('isVegan', checked as boolean)}
                />
                <Label htmlFor="isVegan">Item vegano</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAvailable"
                  checked={editedItem.isAvailable}
                  onCheckedChange={(checked) => handleCheckboxChange('isAvailable', checked as boolean)}
                />
                <Label htmlFor="isAvailable">Está disponível</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white" disabled={isUploading}>
                {isUploading ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}