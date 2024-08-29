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


// Schema de validação para criação ou atualização de uma categoria
export const upsertCategorySchema = z.object({
  id: z.string().optional(), // ID da categoria (opcional, usado para atualização)
  name: z.string().nonempty('Name is required'), // Nome da categoria (obrigatório)
  restaurantId: z.string().optional(), // ID do restaurante (opcional para atualização, obrigatório para criação)
});

// Schema de validação para criar um novo item
export const createNewItemSchema = z.object({
  name: z.string().nonempty('Name is required'), // Nome do item (obrigatório)
  description: z.string().nonempty('Description is required'), // Descrição do item (obrigatório)
  price: z.string().nonempty('Price is required'), // Preço do item (obrigatório)
  isVegan: z.boolean(), // Indica se o item é vegano (obrigatório)
  isAvailable: z.boolean(), // Indica se o item está disponível (obrigatório)
  imageUrl: z.string().url().optional(), // URL da imagem (opcional)
  categoryId: z.string().nonempty('Category ID is required'), // ID da categoria (obrigatório)
});

// Define the schema for updating an item
export const updateItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  isVegan: z.boolean(),
  isAvailable: z.boolean(),
  imageUrl: z.string().optional(),
  categoryId: z.string(),
});