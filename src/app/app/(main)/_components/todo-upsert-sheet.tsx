'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useRef } from 'react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Todo } from '../types'
import { upsertTodo } from '../actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { upsertTodoSchema } from '../schema'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

// Define os tipos de propriedades para o componente TodoUpsertSheet
type TodoUpsertSheetProps = {
  children?: React.ReactNode  // Propriedades opcionais para exibir o componente filho
  defaultValue?: Todo         // Valor padrão para a tarefa, usado para edição
}

// Componente principal que encapsula o formulário de criação/edição de tarefas
export function TodoUpsertSheet({ children }: TodoUpsertSheetProps) {
  const ref = useRef<HTMLDivElement>(null) // Cria uma referência para o botão de ativação do Sheet
  const router = useRouter() // Hook do Next.js para manipular navegações

  // Configuração do formulário utilizando React Hook Form com validação via Zod
  const form = useForm({
    resolver: zodResolver(upsertTodoSchema), // Validação do formulário usando o schema definido
  })

  // Função chamada ao submeter o formulário
  const onSubmit = form.handleSubmit(async (data) => {
    await upsertTodo(data) // Salva ou atualiza a tarefa com os dados do formulário
    router.refresh() // Recarrega a página para refletir as mudanças

    ref.current?.click() // Fecha o Sheet após a submissão

    // Exibe uma notificação de sucesso
    toast({
      title: 'Success',
      description: 'Your todo has been updated successfully.',
    })
  })

  return (
    <Sheet>
      {/* Botão de ativação do Sheet, que envolve os filhos do componente */}
      <SheetTrigger asChild>
        <div ref={ref}>{children}</div>
      </SheetTrigger>
      
      {/* Conteúdo do Sheet, que inclui o formulário para criar/editar a tarefa */}
      <SheetContent>
        {/* Formulário usando React Hook Form */}
        <Form {...form}>
          {/* Define o que acontece ao submeter o formulário */}
          <form onSubmit={onSubmit} className="space-y-8 h-screen">
            
            {/* Cabeçalho do Sheet com título e descrição */}
            <SheetHeader>
              <SheetTitle>Upsert Todo</SheetTitle>
              <SheetDescription>
                Add or edit your todo item here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>

            {/* Campo do formulário para o título da tarefa */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your todo title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the publicly displayed name for the task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rodapé do Sheet com o botão de salvar */}
            <SheetFooter className="mt-auto">
              <Button type="submit">Save changes</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
