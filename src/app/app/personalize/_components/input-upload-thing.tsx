'use client'

import { useState, useRef } from 'react'
import { Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { toast } from '@/components/ui/use-toast'

interface InputUploadThingProps {
  currentImageUrl: string
  onImageSelect: (file: File | null) => void
}

export default function InputUploadThing({ currentImageUrl, onImageSelect }: InputUploadThingProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // alert("A imagem deve ter no máximo 2MB")
        toast({
          title: 'Erro',
          description: 'A imagem deve ter o tamanho máximo de 2MB.',
        })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPreviewUrl = reader.result as string
        setPreviewUrl(newPreviewUrl)
      }
      reader.readAsDataURL(file)
      onImageSelect(file)
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
    <div className="relative w-48 h-48 mx-auto">
      <div className="w-full h-full rounded-lg overflow-hidden">
        <Image
          src={previewUrl || currentImageUrl}
          alt="Imagem de perfil do restaurante"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity opacity-0 hover:opacity-100">
        <label
          htmlFor="logo-upload"
          className="cursor-pointer text-center"
        >
          <div className="bg-white text-black px-3 py-2 rounded-md">
            <Camera className="h-5 w-5 mx-auto mb-1" />
            <span className="text-sm font-medium">
              {previewUrl ? 'Alterar imagem' : 'Selecionar imagem'}
            </span>
          </div>
          <p className="text-white text-xs mt-2">Máximo: 2MB</p>
        </label>
        <Input
          id="logo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
          ref={fileInputRef}
        />
      </div>
      {previewUrl && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-0 right-0 rounded-full"
          onClick={handleRemoveNewImage}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}