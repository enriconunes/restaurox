'use client'

import { useState } from 'react'
import { Plus, Image as ImageIcon } from 'lucide-react'
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

interface AddNewItemModalProps {
  onAddItem: (item: {
    name: string
    description: string
    price: string
    imageUrl: string
    isAvailable: boolean
    isVegan: boolean
  }) => void
}

export default function AddNewItemModal({ onAddItem }: AddNewItemModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    isAvailable: true,
    isVegan: false,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setNewItem(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setNewItem(prev => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddItem(newItem)
    setIsOpen(false)
    setNewItem({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      isAvailable: true,
      isVegan: false,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-2 mb-4 hover:bg-muted">
          <Plus className="h-4 w-4 mr-2" /> Adicionar novo item dessa categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="imageUrl" className="sr-only">Imagem</Label>
            <div className="h-32 w-full border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-muted-foreground/50">
              {newItem.imageUrl ? (
                <img
                  src={newItem.imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <span className="mt-2 block text-sm font-semibold text-muted-foreground">
                    Adicionar imagem
                  </span>
                </div>
              )}
              <Input
                id="imageUrl"
                name="imageUrl"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setNewItem(prev => ({ ...prev, imageUrl: reader.result as string }))
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                className="hidden"
              />
            </div>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name" className="sr-only">Nome do item</Label>
            <Input
              id="name"
              name="name"
              placeholder="Digite o nome do item"
              value={newItem.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="price" className="sr-only">Preço</Label>
            <Input
              id="price"
              name="price"
              placeholder="Digite o preço"
              value={newItem.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description" className="sr-only">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Digite a descrição"
              value={newItem.description}
              onChange={handleInputChange}
              className="resize-none"
              rows={3}
            />
            <div className="text-sm text-muted-foreground text-right">
              {newItem.description.length}/255
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isVegan"
              checked={newItem.isVegan}
              onCheckedChange={(checked) => handleCheckboxChange('isVegan', checked as boolean)}
            />
            <Label htmlFor="isVegan">Item vegano</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAvailable"
              checked={newItem.isAvailable}
              onCheckedChange={(checked) => handleCheckboxChange('isAvailable', checked as boolean)}
            />
            <Label htmlFor="isAvailable">Está disponível</Label>
          </div>
          <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white">
            Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}