'use server'

import { auth } from '@/services/auth' // Importa o serviço de autenticação
import { prisma } from '@/services/database' // Importa o serviço de banco de dados Prisma
import { z } from 'zod' // Importa o Zod para validação de schemas
import { deleteTodoSchema, upsertTodoSchema } from './schema' // Importa os schemas de validação

// Função para obter as tarefas do usuário autenticado
export async function getUserTodos() {
  const session = await auth() // Obtém a sessão de autenticação

  // Busca as tarefas no banco de dados associadas ao usuário autenticado
  const todos = await prisma.todo.findMany({
    where: {
      userId: session?.user?.id, // Filtra as tarefas pelo ID do usuário
    },
    orderBy: {
      createdAt: 'desc', // Ordena as tarefas pela data de criação em ordem decrescente
    },
  })

  return todos // Retorna as tarefas encontradas
}

// Função para criar ou atualizar uma tarefa
export async function upsertTodo(input: z.infer<typeof upsertTodoSchema>) {
  const session = await auth() // Obtém a sessão de autenticação

  // Verifica se o usuário está autenticado
  if (!session?.user?.id) {
    return {
      error: 'Not authorized', // Retorna um erro se não estiver autenticado
      data: null,
    }
  }

  // Se um ID for fornecido, a tarefa será atualizada
  if (input.id) {
    // Verifica se a tarefa existe e pertence ao usuário autenticado
    const todo = await prisma.todo.findUnique({
      where: {
        id: input.id,
        userId: session?.user?.id,
      },
      select: {
        id: true, // Seleciona apenas o ID da tarefa
      },
    })

    // Retorna um erro se a tarefa não for encontrada
    if (!todo) {
      return {
        error: 'Not found',
        data: null,
      }
    }

    // Atualiza a tarefa com os novos dados
    const updatedTodo = await prisma.todo.update({
      where: {
        id: input.id,
        userId: session?.user?.id,
      },
      data: {
        title: input.title, // Atualiza o título
        doneAt: input.doneAt, // Atualiza o status de conclusão
      },
    })

    return {
      error: null,
      data: updatedTodo, // Retorna a tarefa atualizada
    }
  }

  // Se o título não for fornecido, retorna um erro
  if (!input.title) {
    return {
      error: 'Title is required', // O título é obrigatório para criar uma tarefa
      data: null,
    }
  }

  // Cria uma nova tarefa com os dados fornecidos
  const todo = await prisma.todo.create({
    data: {
      title: input.title, // Define o título da nova tarefa
      userId: session?.user?.id, // Associa a tarefa ao usuário autenticado
    },
  })

  return todo // Retorna a tarefa criada
}

// Função para excluir uma tarefa
export async function deleteTodo(input: z.infer<typeof deleteTodoSchema>) {
  const session = await auth() // Obtém a sessão de autenticação

  // Verifica se o usuário está autenticado
  if (!session?.user?.id) {
    return {
      error: 'Not authorized', // Retorna um erro se não estiver autenticado
      data: null,
    }
  }

  // Verifica se a tarefa existe e pertence ao usuário autenticado
  const todo = await prisma.todo.findUnique({
    where: {
      id: input.id,
      userId: session?.user?.id,
    },
    select: {
      id: true, // Seleciona apenas o ID da tarefa
    },
  })

  // Retorna um erro se a tarefa não for encontrada
  if (!todo) {
    return {
      error: 'Not found',
      data: null,
    }
  }

  // Exclui a tarefa do banco de dados
  await prisma.todo.delete({
    where: {
      id: input.id,
      userId: session?.user?.id,
    },
  })

  return {
    error: null,
    data: 'Todo deleted successfully', // Retorna uma mensagem de sucesso
  }
}

export const getUserRestaurantDetails = async (idUser: string) => {
  try {
    // Busca o primeiro restaurante associado ao usuário
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: idUser,
      },
      include: {
        openingHours: true, // Incluir horários de funcionamento
        itemCategories: {
          include: {
            items: true, // Incluir itens de cada categoria
          },
        },
      },
    });

    if (!restaurant) {
      return {
        error: 'Restaurante não encontrado para este usuário',
        data: null,
      };
    }

    return {
      error: null, // Nenhum erro ocorreu
      data: restaurant, // Dados do restaurante com horários e categorias
    };
  } catch (error) {
    console.error('Erro ao obter detalhes do restaurante do usuário:', error);

    return {
      error: 'Falha ao obter detalhes do restaurante do usuário',
      data: null,
    };
  }
};
