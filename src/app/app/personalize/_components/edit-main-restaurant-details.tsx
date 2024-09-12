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
import { useUploadThing } from '@/utils/uploadthing';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface RestaurantData {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  instagramProfileName: string;
  doDelivery: boolean;
  doOrder: boolean;
  deliveryFee: string;
  deliveryTimeMinutes: string;
  avatarUrl: string;
}

interface EditRestaurantInfoProps {
  data: RestaurantData;
  planName: string | null | undefined
}

export default function EditRestaurantInfo({ data, planName }: EditRestaurantInfoProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader");
  const [showProAlert, setShowProAlert] = useState(false);

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
      doOrder: data.doOrder,
    },
  });

  const onSubmit = async (updatedInfo: z.infer<typeof updateRestaurantSchema>) => {
    setIsSubmitting(true);
    try {
      let newAvatarUrl = updatedInfo.avatarUrl;

      if (selectedFile) {
        const uploadResult = await startUpload([selectedFile]);
        if (uploadResult && uploadResult[0]) {
          newAvatarUrl = uploadResult[0].url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      const result = await updateRestaurantDetailsByRestaurantId(data.id, {
        ...updatedInfo,
        avatarUrl: newAvatarUrl,
      });

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Editar informações do restaurante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/3">
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputUploadThing
                          currentImageUrl={field.value}
                          onImageSelect={(file) => setSelectedFile(file)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
              <ProFeatureWrapper label="Taxa de entrega">
                <FormField
                  control={form.control}
                  name="deliveryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de entrega</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite a taxa de entrega" 
                          {...field} 
                          disabled={isFreePlan}
                          onClick={isFreePlan ? handleProFeatureClick : undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ProFeatureWrapper>
              <ProFeatureWrapper label="Tempo de entrega">
                <FormField
                  control={form.control}
                  name="deliveryTimeMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de entrega (minutos)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite o tempo de entrega" 
                          {...field} 
                          disabled={isFreePlan}
                          onClick={isFreePlan ? handleProFeatureClick : undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ProFeatureWrapper>
            </div>
            <div className="mt-4 space-y-2">
              <ProFeatureWrapper label="Permitir pedidos pelo cardápio">
                <FormField
                  control={form.control}
                  name="doOrder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isFreePlan}
                          onClick={isFreePlan ? handleProFeatureClick : undefined}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Permitir pedidos pelo cardápio
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </ProFeatureWrapper>
              <ProFeatureWrapper label="Permitir pedidos para Delivery">
                <FormField
                  control={form.control}
                  name="doDelivery"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isFreePlan}
                          onClick={isFreePlan ? handleProFeatureClick : undefined}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Permitir pedidos para Delivery
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </ProFeatureWrapper>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
          {isSubmitting || isUploading ? 'Salvando...' : 'Salvar alterações'}
        </Button>

        {showProAlert && (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Funcionalidade PRO</AlertTitle>
            <AlertDescription>
              Esta funcionalidade está disponível apenas para o plano PRO. 
              <Link href="/billing" className="ml-1 font-medium underline underline-offset-4">
                Atualize seu plano agora!
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
}