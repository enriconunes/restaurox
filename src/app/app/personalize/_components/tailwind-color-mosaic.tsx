'use client'

import React, { useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const tailwindColors = [
  { name: 'gray', shades: { 400: '#9ca3af', 700: '#374151', 950: '#030712' }},
  { name: 'red', shades: { 400: '#f87171', 700: '#b91c1c', 950: '#450a0a' }},
  { name: 'orange', shades: { 400: '#fb923c', 700: '#c2410c', 950: '#431407' }},
  { name: 'yellow', shades: { 400: '#facc15', 700: '#a16207', 950: '#422006' }},
  { name: 'green', shades: { 400: '#4ade80', 700: '#15803d', 950: '#052e16' }},
  { name: 'cyan', shades: { 400: '#22d3ee', 700: '#0e7490', 950: '#083344' }},
  { name: 'blue', shades: { 400: '#60a5fa', 700: '#1d4ed8', 950: '#172554' }},
  { name: 'purple', shades: { 400: '#a78bfa', 700: '#7e22ce', 950: '#3b0764' }},
  { name: 'pink', shades: { 400: '#f472b6', 700: '#be185d', 950: '#500724' }},
]

export default function TailwindColorSelectorForm() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Selected color:', selectedColor)
    // Here you would typically send the selected color to your backend
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Alterar Tema dos Elementos do Cardápio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base">Escolha uma cor primária para personalizar o seu cardápio:</Label>
            {tailwindColors.map((colorFamily) => (
              <div key={colorFamily.name} className="grid grid-cols-3 gap-2">
                {Object.entries(colorFamily.shades).map(([shade, hex]) => (
                  <button
                    key={`${colorFamily.name}-${shade}`}
                    type="button"
                    className={`w-full h-12 rounded-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${
                      selectedColor === hex ? 'ring-2 ring-offset-2 ring-opacity-50 scale-105' : ''
                    }`}
                    style={{ backgroundColor: hex }}
                    onClick={() => setSelectedColor(hex)}
                    aria-label={`Select color ${hex}`}
                  >
                    <span className="sr-only">Select color {hex}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
          {selectedColor && (
            <div className="text-lg">
              <Label>Cor selecionada:</Label>
              <div className="flex items-center space-x-2 mt-1">
                <div 
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: selectedColor }}
                ></div>
                <span className="font-bold">{selectedColor}</span>
              </div>
            </div>
          )}
          <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white" disabled={!selectedColor}>
            <Save className="mr-2 h-4 w-4" /> Salvar cor selecionada
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}