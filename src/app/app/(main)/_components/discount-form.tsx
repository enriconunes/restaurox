'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Item, Discount } from '../types'
import { upsertDiscountSchema } from '../schema'
import { upsertDiscountToItem, deleteDiscountById } from '../actions'

const discountFormSchema = upsertDiscountSchema.extend({
  hasExpirationDate: z.boolean(),
})

type DiscountFormValues = z.infer<typeof discountFormSchema>

interface DiscountFormProps {
  item: Item;
  onSave: (updatedItem: Item) => void;
}

export function DiscountForm({ item, onSave }: DiscountFormProps) {
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      itemId: item.id,
      discountId: item.discount?.id,
      newPrice: item.discount?.newPrice || '',
      hasExpirationDate: item.discount?.expiration ? new Date(item.discount.expiration).getTime() !== new Date('9999-12-31T23:59:59.999Z').getTime() : false,
      expiration: item.discount?.expiration && new Date(item.discount.expiration).getTime() !== new Date('9999-12-31T23:59:59.999Z').getTime()
        ? new Date(item.discount.expiration).toISOString().split('T')[0]
        : undefined,
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const input = {
        itemId: values.itemId,
        discountId: item.discount?.id, // Only pass discountId if it exists (for updates)
        newPrice: values.newPrice,
        expiration: values.hasExpirationDate && values.expiration
          ? new Date(values.expiration).toISOString()
          : undefined, // Use undefined instead of null
      }

      const result = await upsertDiscountToItem(input)

      if (result.error) {
        throw new Error(result.error)
      }

      if (!result.data) {
        throw new Error('Nenhum dado retornado ao aplicar o desconto')
      }

      const updatedDiscount: Discount = {
        id: result.data.id,
        itemId: result.data.itemId,
        newPrice: result.data.newPrice,
        expiration: result.data.expiration ? result.data.expiration.toISOString() : null,
      }

      const updatedItem: Item = { ...item, discount: updatedDiscount }
      onSave(updatedItem)
      setIsEditing(false)
      toast({
        title: 'Sucesso',
        description: 'Desconto aplicado com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao aplicar o desconto.',
        variant: 'destructive',
      })
      console.error('Erro ao aplicar desconto:', error)
    }
  })

  const handleDeleteDiscount = async () => {
    try {
      if (!item.discount?.id) {
        throw new Error('Não há desconto para remover')
      }

      const result = await deleteDiscountById(item.discount.id)

      if (result.error) {
        throw new Error(result.error)
      }

      const updatedItem = { ...item, discount: null }
      onSave(updatedItem)
      toast({
        title: 'Sucesso',
        description: 'Desconto removido com sucesso.',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao remover o desconto.',
        variant: 'destructive',
      })
      console.error('Erro ao remover desconto:', error)
    }
  }

  const formatCurrency = (value: string) => {
    const number = parseFloat(value)
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (item.discount && !isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p><strong>Preço com desconto:</strong> {formatCurrency(item.discount.newPrice)}</p>
          {item.discount.expiration && new Date(item.discount.expiration).getTime() !== new Date('9999-12-31T23:59:59.999Z').getTime() ? (
            <p><strong>Data de expiração:</strong> {new Date(item.discount.expiration).toLocaleDateString('pt-BR')}</p>
          ) : (
            <p><strong>Data de expiração:</strong> Sem validade.</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => setIsEditing(true)} variant="outline">Editar Desconto</Button>
          <Button onClick={handleDeleteDiscount} variant="destructive">Remover Desconto</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="newPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço com desconto</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Digite o preço com desconto"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    const parts = value.split('.');
                    if (parts.length > 1) {
                      parts[1] = parts[1].slice(0, 2);
                    }
                    field.onChange(parts.join('.'));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hasExpirationDate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Definir data de expiração
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        {form.watch('hasExpirationDate') && (
          <FormField
            control={form.control}
            name="expiration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de expiração</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value || undefined)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white">
          {item.discount ? 'Atualizar Desconto' : 'Aplicar Desconto'}
        </Button>
        {isEditing && (
          <Button type="button" onClick={() => setIsEditing(false)} className="w-full mt-2" variant="outline">
            Cancelar Edição
          </Button>
        )}
      </form>
    </Form>
  )
}