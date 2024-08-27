'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { updateRestaurantDetailsByRestaurantId } from '../(main)/actions';
import { updateRestaurantSchema } from '../schemas';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputUploadThing from './input-upload-thing';

interface RestaurantData {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  instagramProfileName: string;
  doDelivery: boolean;
  deliveryFee: string;
  deliveryTimeMinutes: string;
  avatarUrl: string;
}

interface EditRestaurantInfoProps {
  data: RestaurantData;
}

export default function EditRestaurantInfo({ data }: EditRestaurantInfoProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof updateRestaurantSchema>>({
    resolver: zodResolver(updateRestaurantSchema),
    defaultValues: {
      name: data.name,
      address: data.address,
      contactNumber: data.contactNumber,
      instagramProfileName: data.instagramProfileName,
      deliveryFee: data.deliveryFee,
      deliveryTimeMinutes: data.deliveryTimeMinutes,
      doDelivery: data.doDelivery,
      avatarUrl: data.avatarUrl,
    },
  });

  const onSubmit = async (updatedInfo: z.infer<typeof updateRestaurantSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await updateRestaurantDetailsByRestaurantId(data.id, updatedInfo);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: 'Sucesso',
        description: 'As informações do restaurante foram atualizadas com sucesso.',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o restaurante.',
        variant: 'destructive',
      });
      console.error('Erro ao atualizar o restaurante:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Editar informações do restaurante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/3">
                <InputUploadThing
                  currentImageUrl={form.watch('avatarUrl')}
                  onImageChange={(file, previewUrl) =>
                    form.setValue('avatarUrl', previewUrl || '')
                  }
                />
              </div>
              <div className="w-full sm:w-2/3 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do restaurante</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome do restaurante" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o número de telefone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o endereço" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagramProfileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil do Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o perfil do Instagram" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deliveryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa de entrega</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a taxa de entrega" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryTimeMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo de entrega (minutos)</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o tempo de entrega" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="doDelivery"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Delivery disponível
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>
    </Form>
  );
}