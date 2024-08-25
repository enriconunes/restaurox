import { z } from 'zod' // Importa o Zod para validação de schemas

// Schema de validação para criação ou atualização de uma tarefa
export const upsertTodoSchema = z.object({
  id: z.string().optional(), // ID da tarefa (opcional, usado para atualização)
  title: z.string().optional(), // Título da tarefa (opcional, mas necessário para criação)
  doneAt: z.string().optional().nullable(), // Data de conclusão da tarefa (opcional e pode ser nulo)
})

// Schema de validação para exclusão de uma tarefa
export const deleteTodoSchema = z.object({
  id: z.string(), // ID da tarefa (obrigatório para exclusão)
})
