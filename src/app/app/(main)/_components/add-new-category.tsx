'use client'

import { useState } from 'react';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RestaurantData } from '@/app/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { upsertCategorySchema } from '../schema';
import { upsertCategory } from '../actions';
import { toast } from '@/components/ui/use-toast';

interface AddNewCategoryProps {
  data: RestaurantData | null;
}

export default function AddNewCategory({ data }: AddNewCategoryProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const categories = data?.itemCategories || [];
  const restaurantId = data?.id;

  const form = useForm({
    resolver: zodResolver(upsertCategorySchema),
    defaultValues: {
      name: '',
      restaurantId: restaurantId,
    },
  });

  const onSubmit = form.handleSubmit(async (formData) => {
    try {
      await upsertCategory(formData);
      toast({
        title: 'Sucesso',
        description: 'Categoria adicionada com sucesso.',
      });
      setIsFormVisible(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao adicionar categoria. Por favor, tente novamente.',
      });
    }
  });
  

  if (categories.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto lg:p-6 mt-4 lg:mt-0">
        <Card className="bg-background text-foreground">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
            <CardTitle className="text-xl mb-2">Seu cardápio ainda está vazio</CardTitle>
            <p className="text-muted-foreground mb-4">
              Comece adicionando uma nova categoria de alimentos para cadastrar os primeiros itens do seu cardápio.
            </p>
            <Button onClick={() => setIsFormVisible(!isFormVisible)} className="bg-red-700 hover:bg-red-800 text-white">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" /> Adicionar nova categoria
            </Button>
            {isFormVisible && (
              <form onSubmit={onSubmit} className="p-4 border-t mt-4 border-border w-full">
                <Input
                  type="text"
                  placeholder="Digite o nome da categoria"
                  {...form.register('name')}
                  className="mb-4"
                  aria-label="Nome da categoria"
                />
                <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white">
                  Adicionar
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto lg:px-6 pt-6">
      <Card className="bg-background text-foreground">
        <CardContent className="p-0">
          <Button
            onClick={() => setIsFormVisible(!isFormVisible)}
            variant="ghost"
            className="w-full justify-between p-4 rounded-t-lg hover:bg-muted"
          >
            <span className="font-semibold">Adicionar nova categoria</span>
            <Plus className={`h-5 w-5 transition-transform ${isFormVisible ? 'rotate-45' : ''}`} aria-hidden="true" />
          </Button>

          {isFormVisible && (
            <form onSubmit={onSubmit} className="p-4 border-t border-border">
              <Input
                type="text"
                placeholder="Digite o nome da categoria"
                {...form.register('name')}
                className="mb-4"
                aria-label="Nome da categoria"
              />
              <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white">
                Adicionar
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}