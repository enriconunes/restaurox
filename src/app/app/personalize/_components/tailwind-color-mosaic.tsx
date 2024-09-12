'use client'

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { updateRestaurantColorTheme } from '../(main)/actions';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

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

interface TailwindColorSelectorFormProps {
  data: string | null;
  idUser: string;
  planName: string | null | undefined
}

export default function TailwindColorSelectorForm({ data, idUser, planName }: TailwindColorSelectorFormProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(data);
  const [customColor, setCustomColor] = useState<string>('#000000');
  const [showProAlert, setShowProAlert] = useState(false);

  useEffect(() => {
    if (data) {
      setSelectedColor(data);
      setCustomColor(data);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedColor) return;

    if (isFreePlan) {
      handleProFeatureClick();
      return;
    }

    try {
      const response = await updateRestaurantColorTheme(idUser, selectedColor);

      if (response.error) {
        console.error('Erro ao atualizar tema de cor:', response.error);
        toast({
          title: 'Erro',
          description: 'Houve um erro ao atualizar o tema do cardápio. Por favor, tente novamente.',
        });
      } else {
        console.log('Tema de cor atualizado com sucesso:', response.data);
        toast({
          title: 'Sucesso',
          description: 'Tema do cardápio atualizado com sucesso.',
        });
      }
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
    }
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    setSelectedColor(newColor);
  };

  const handleProFeatureClick = () => {
    setShowProAlert(true);
    setTimeout(() => setShowProAlert(false), 5000);
  };

  const isFreePlan = planName === 'free';

  const ProFeatureWrapper = ({ children, label }: { children: React.ReactNode; label: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            {children}
            {isFreePlan && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2">
                <Badge variant="secondary" className="text-xs font-normal bg-primary/10 text-primary">
                  PRO
                </Badge>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label} - Disponível apenas no plano PRO</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl">Alterar Tema do Cardápio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ProFeatureWrapper label="Escolha uma cor primária">
            <div>
              <Label className="text-sm font-medium mb-1 block">Escolha uma cor primária</Label>
              <p className='text-xs text-gray-600 mb-3'>
                Essa cor será usada para personalizar os elementos do seu cardápio, como o <span className='font-medium'>banner</span> e os <span className='font-medium'>botões de interação</span>.
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                {tailwindColors.map((colorFamily) =>
                  Object.entries(colorFamily.shades).map(([shade, hex]) => (
                    <TooltipProvider key={`${colorFamily.name}-${shade}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className={`w-full aspect-square rounded-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 ${
                              selectedColor === hex ? 'ring-2 ring-offset-2 ring-opacity-50 scale-110' : ''
                            }`}
                            style={{ backgroundColor: hex }}
                            onClick={() => isFreePlan ? handleProFeatureClick() : setSelectedColor(hex)}
                            aria-label={`Select color ${colorFamily.name} ${shade}`}
                            disabled={isFreePlan}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-xs">{colorFamily.name} {shade}</p>
                          <p className="text-xs font-mono">{hex}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))
                )}
              </div>
            </div>
          </ProFeatureWrapper>
          <ProFeatureWrapper label="Cor Personalizada">
            <div>
              <Label className="text-sm font-medium mb-1 block">Cor Personalizada</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-12 h-12 p-1 rounded-md"
                  disabled={isFreePlan}
                  onClick={isFreePlan ? handleProFeatureClick : undefined}
                />
                <Input
                  type="text"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="flex-grow"
                  placeholder="Digite um valor hexadecimal"
                  disabled={isFreePlan}
                  onClick={isFreePlan ? handleProFeatureClick : undefined}
                />
              </div>
            </div>
          </ProFeatureWrapper>
          {selectedColor && (
            <div className="flex items-center space-x-2 text-sm">
              <Label className="font-medium">Cor selecionada:</Label>
              <div 
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: selectedColor }}
              ></div>
              <span className="font-mono">{selectedColor}</span>
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full bg-red-700 hover:bg-red-800 text-white" 
            disabled={!selectedColor || isFreePlan}
            onClick={isFreePlan ? handleProFeatureClick : undefined}
          >
            <Save className="mr-2 h-4 w-4" /> Salvar cor
          </Button>
        </form>
        {showProAlert && (
          <Alert variant="default" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Funcionalidade PRO</AlertTitle>
            <AlertDescription>
              A personalização de cores está disponível apenas para o plano PRO. 
              <Link href="/billing" className="ml-1 font-medium underline underline-offset-4">
                Atualize seu plano agora!
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}