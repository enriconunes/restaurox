'use client'

import { useState, useRef } from 'react'
import { Camera, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { toast } from '@/components/ui/use-toast'
import { compressImage } from '@/utils/imageCompression'

interface InputUploadThingItemProps {
  currentImageUrl: string
  onImageSelect: (file: File | null) => void
}

export function InputUploadThingItem({ currentImageUrl, onImageSelect }: InputUploadThingItemProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Erro',
          description: 'A imagem deve ter o tamanho máximo de 2MB.',
        })
        return
      }
      
      try {
        const compressedFile = await compressImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          const newPreviewUrl = reader.result as string
          setPreviewUrl(newPreviewUrl)
        }
        reader.readAsDataURL(compressedFile)
        onImageSelect(compressedFile)
      } catch (error) {
        console.error('Error compressing image:', error)
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao processar a imagem.',
        })
      }
    }
  }

  const handleRemoveNewImage = () => {
    onImageSelect(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="relative w-full h-48 mx-auto border-2 border-dashed rounded-lg overflow-hidden">
      {previewUrl || currentImageUrl ? (
        <Image
          src={previewUrl || currentImageUrl}
          alt="Imagem do item"
          layout="fill"
          objectFit="cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-muted">
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Nenhuma imagem selecionada</span>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity opacity-0 hover:opacity-100">
        <label
          htmlFor="item-image-upload"
          className="cursor-pointer text-center"
        >
          <div className="bg-white text-black px-3 py-2 rounded-md">
            <Camera className="h-5 w-5 mx-auto mb-1" />
            <span className="text-sm font-medium">
              {previewUrl || currentImageUrl ? 'Alterar imagem' : 'Selecionar imagem'}
            </span>
          </div>
          <p className="text-white text-xs mt-2">Máximo: 2MB</p>
        </label>
        <Input
          id="item-image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
          ref={fileInputRef}
        />
      </div>
      {(previewUrl || currentImageUrl) && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 rounded-full"
          onClick={handleRemoveNewImage}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}