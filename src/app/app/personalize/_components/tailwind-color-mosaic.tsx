'use client'

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
];

// Adiciona a prop 'data' ao componente
interface TailwindColorSelectorFormProps {
  data: string | null; // Defina como null caso o tema de cor não exista
}

export default function TailwindColorSelectorForm({ data }: TailwindColorSelectorFormProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(data);

  // Adiciona um efeito para atualizar o estado inicial quando a 'data' mudar
  useEffect(() => {
    if (data) {
      setSelectedColor(data);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Selected color:', selectedColor);
    // Aqui você normalmente enviaria a cor selecionada para o backend
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Alterar Tema do Cardápio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm block mb-2">Escolha uma cor primária.</Label>
            <p className='text-xs leading-2'>*Essa cor será usada para personalizar os elementos do seu cardápio, como o <span className='font-bold'>banner</span> por trás da logomarca e os <span className='font-bold'>botões de interação</span>.</p>
            <div className="grid grid-cols-9 gap-1 mt-4">
              {tailwindColors.map((colorFamily) =>
                Object.entries(colorFamily.shades).map(([shade, hex]) => (
                  <TooltipProvider key={`${colorFamily.name}-${shade}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={`w-full aspect-square rounded-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${
                            selectedColor === hex ? 'ring-2 ring-offset-2 ring-opacity-50 scale-110' : ''
                          }`}
                          style={{ backgroundColor: hex }}
                          onClick={() => setSelectedColor(hex)}
                          aria-label={`Select color ${colorFamily.name} ${shade}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{colorFamily.name} {shade}</p>
                        <p>{hex}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))
              )}
            </div>
          </div>
          {selectedColor && (
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">Cor selecionada:</Label>
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: selectedColor }}
              ></div>
              <span className="text-sm font-bold">{selectedColor}</span>
            </div>
          )}
          <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white" disabled={!selectedColor}>
            <Save className="mr-2 h-4 w-4" /> Salvar cor
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
