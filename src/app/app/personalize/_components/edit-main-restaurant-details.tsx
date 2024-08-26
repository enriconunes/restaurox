'use client'

import { useState } from 'react'
import { Camera, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RestaurantInfo {
  name: string
  address: string
  phone: string
  instagram: string
  deliveryFee: string
  deliveryTime: string
  isDeliveryAvailable: boolean
  logoUrl: string
}

export default function EditRestaurantInfo() {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: 'Pizzaria Lenha na Brasa',
    address: 'Rua das Andorinhas nº 24, Mirante Caravelas',
    phone: '73988909876',
    instagram: '_lenhanabrasa_',
    deliveryFee: '5,80',
    deliveryTime: '30',
    isDeliveryAvailable: true,
    logoUrl: 'https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRestaurantInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setRestaurantInfo(prev => ({ ...prev, isDeliveryAvailable: checked }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setRestaurantInfo(prev => ({ ...prev, logoUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Restaurant info updated:', restaurantInfo)
    // Here you would typically send the updated info to your backend
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar informações do restaurante</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={restaurantInfo.logoUrl}
                alt="Logo do restaurante"
                className="w-32 h-32 rounded-lg object-cover"
              />
              <Label htmlFor="logo-upload" className="absolute bottom-0 right-0 bg-background rounded-full p-2 cursor-pointer">
                <Camera className="h-5 w-5" />
              </Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do restaurante</Label>
            <Input
              id="name"
              name="name"
              value={restaurantInfo.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              name="address"
              value={restaurantInfo.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Número de telefone</Label>
            <Input
              id="phone"
              name="phone"
              value={restaurantInfo.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Perfil do Instagram</Label>
            <Input
              id="instagram"
              name="instagram"
              value={restaurantInfo.instagram}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryFee">Valor da taxa de entrega (delivery)</Label>
            <Input
              id="deliveryFee"
              name="deliveryFee"
              value={restaurantInfo.deliveryFee}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryTime">Tempo médio do delivery (em minutos)</Label>
            <Input
              id="deliveryTime"
              name="deliveryTime"
              value={restaurantInfo.deliveryTime}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDeliveryAvailable"
              checked={restaurantInfo.isDeliveryAvailable}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="isDeliveryAvailable">Delivery disponível</Label>
          </div>

          <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white">
            <Save className="mr-2 h-4 w-4" /> Salvar descrição
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}