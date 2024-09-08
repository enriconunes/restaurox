'use server'

import { auth } from '@/services/auth' // Importa o serviço de autenticação
import { prisma } from '@/services/database' // Importa o serviço de banco de dados Prisma
import { z } from 'zod' // Importa o Zod para validação de schemas
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { deleteTodoSchema, upsertTodoSchema, upsertCategorySchema, createNewItemSchema, updateItemSchema, upsertDiscountSchema } from './schema' // Importa os schemas de validação
import { getUserCurrentPlan } from '@/services/stripe'

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
  // Se a funcao nao receber um input, significa que é para criar uma nova tarefa
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

// funcao principal da pagina inicial do dashboard para visao geral do cardapio
export const getUserRestaurantDetails = async (idUser: string) => {
  try {
    // Busca o primeiro restaurante associado ao usuário
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: idUser,
      },
      include: {
        openingHours: true, // Inclui horários de funcionamento
        itemCategories: {
          include: {
            items: {
              where: {
                deletedAt: null, // Filtra apenas itens que não foram deletados logicamente
              },
              include: {
                discount: true, // Inclui informações de desconto para cada item
              },
            },
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

// Função para criar ou atualizar uma categoria
export async function upsertCategory(input: z.infer<typeof upsertCategorySchema>) {
  const session = await auth(); // Obtém a sessão de autenticação

  // Verifica se o usuário está autenticado
  if (!session?.user?.id) {
    return {
      error: 'Not authorized', // Retorna um erro se não estiver autenticado
      data: null,
    };
  }

  // Se um ID for fornecido, a categoria será atualizada
  if (input.id) {
    // Verifica se a categoria existe e pertence ao usuário autenticado
    const category = await prisma.itemCategory.findUnique({
      where: {
        id: input.id,
      },
      select: {
        id: true, // Seleciona apenas o ID da categoria
      },
    });

    // Retorna um erro se a categoria não for encontrada
    if (!category) {
      return {
        error: 'Not found',
        data: null,
      };
    }

    // Atualiza a categoria com os novos dados
    const updatedCategory = await prisma.itemCategory.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name, // Atualiza o nome da categoria
      },
    });

    return {
      error: null,
      data: updatedCategory, // Retorna a categoria atualizada
    };
  }

  // Verifica se o nome e o restaurantId foram fornecidos para criar uma nova categoria
  if (!input.name || !input.restaurantId) {
    return {
      error: 'Name and Restaurant ID are required', // O nome e o restaurantId são obrigatórios para criar uma categoria
      data: null,
    };
  }

  // Cria uma nova categoria com os dados fornecidos
  const category = await prisma.itemCategory.create({
    data: {
      name: input.name, // Define o nome da nova categoria
      restaurantId: input.restaurantId, // Associa a categoria ao restaurante fornecido
    },
  });

  return {
    error: null,
    data: category, // Retorna a categoria criada
  };
}

// Deletar uma categoria de itens pelo seu id
export async function deleteCategory(id: string) {
  const session = await auth(); // Obtém a sessão de autenticação

  // Verifica se o usuário está autenticado
  if (!session?.user?.id) {
    return {
      error: 'Not authorized', // Retorna um erro se o usuário não estiver autenticado
      data: null,
    };
  }

  // Verifica se o ID é válido
  if (!id) {
    return {
      error: 'ID is required', // Retorna um erro se o ID não for fornecido
      data: null,
    };
  }

  // Verifica se a categoria existe e se há itens associados
  const category = await prisma.itemCategory.findUnique({
    where: {
      id: id,
    },
    include: {
      items: {
        select: { id: true },
      },
    },
  });

  // Retorna um erro se a categoria não for encontrada
  if (!category) {
    return {
      error: 'Not found',
      data: null,
    };
  }

  // Verifica se existem itens associados à categoria
  if (category.items.length > 0) {
    return {
      error: 'Remova todos os itens da categoria antes de deletá-la',
      data: null,
    };
  }

  // Deleta a categoria no banco de dados usando Prisma
  await prisma.itemCategory.delete({
    where: { id },
  });

  return {
    error: null,
    data: { message: 'Categoria deletada com sucesso.' }, // Retorna uma mensagem de sucesso
  };
}

// Função para criar um novo item associado a uma categoria
export async function createNewItem(input: z.infer<typeof createNewItemSchema>) {
  const session = await auth(); // Obtém a sessão de autenticação

  // Verifica se o usuário está autenticado
  if (!session?.user?.id) {
    return {
      error: 'Not authorized', // Retorna um erro se não estiver autenticado
      data: null,
    };
  }

  // Verificar o limite de itens antes de adicionar um item novo
  // buscar plano do user logado atraves do seu id
  const plan = await getUserCurrentPlan(session?.user.id as string)

  if(plan.quota.TASKS.usage >= 100){
    return {
      error: 'Limite de itens alcançado. Acesse "Configurações" > "Assinaturas" para mais detalhes.',
      data: null,
    };
  }

  // Verifica se o nome e o categoryId foram fornecidos para criar um novo item
  if (!input.name || !input.categoryId) {
    return {
      error: 'Name and Category ID are required', // O nome e o categoryId são obrigatórios para criar um item
      data: null,
    };
  }

  // Verifica se a categoria associada ao item existe
  const category = await prisma.itemCategory.findUnique({
    where: {
      id: input.categoryId,
    },
    select: {
      id: true, // Seleciona apenas o ID da categoria
    },
  });

  // Retorna um erro se a categoria não for encontrada
  if (!category) {
    return {
      error: 'Category not found',
      data: null,
    };
  }

  // Cria um novo item associado à categoria
  const newItem = await prisma.item.create({
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      isVegan: input.isVegan,
      isAvailable: input.isAvailable,
      imageUrl: input.imageUrl || "https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg", // URL da imagem padrão se não for fornecida
      categoryId: input.categoryId, // Associa o item à categoria fornecida
    },
  });

  return {
    error: null,
    data: newItem, // Retorna o item criado
  };
}

// Function to update an existing item
export async function updateItem(input: z.infer<typeof updateItemSchema>) {
  const session = await auth(); // Get the authentication session

  // Check if the user is authenticated
  if (!session?.user?.id) {
    return {
      error: 'Not authorized', // Return an error if not authenticated
      data: null,
    };
  }

  // Check if the item ID and categoryId were provided
  if (!input.id || !input.categoryId) {
    return {
      error: 'Item ID and Category ID are required', // Item ID and categoryId are required to update an item
      data: null,
    };
  }

  // Check if the item exists
  const existingItem = await prisma.item.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true, // Select only the ID of the item
    },
  });

  // Return an error if the item is not found
  if (!existingItem) {
    return {
      error: 'Item not found',
      data: null,
    };
  }

  // Check if the associated category exists
  // const category = await prisma.itemCategory.findUnique({
  //   where: {
  //     id: input.categoryId,
  //   },
  //   select: {
  //     id: true, // Select only the ID of the category
  //   },
  // });

  // Return an error if the category is not found
  // if (!category) {
  //   return {
  //     error: 'Category not found',
  //     data: null,
  //   };
  // }

  // Update the existing item
  const updatedItem = await prisma.item.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      isVegan: input.isVegan,
      isAvailable: input.isAvailable,
      imageUrl: input.imageUrl || "https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg", // Default image URL if not provided
      categoryId: input.categoryId, // Associate the item with the provided category
    },
  });

  return {
    error: null,
    data: updatedItem, // Return the updated item
  };
}

export async function deleteItemById(itemId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'Not authorized', data: null };
  }

  if (!itemId) {
    return { error: 'Item ID is required', data: null };
  }

  try {
    await prisma.$transaction(async (prisma) => {
      // Primeiro, delete os descontos associados
      await prisma.discount.deleteMany({
        where: { itemId: itemId },
      });

      // Atualize o campo deletedAt para a data e hora atuais
      await prisma.item.update({
        where: { id: itemId },
        data: { deletedAt: new Date() }, // Marca o item como "deletado" logicamente
      });
    });

    return { error: null, data: 'Item successfully marked as deleted' };
  } catch (error) {
    console.error('Error deleting item:', error);
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return { error: 'Cannot delete item: it is referenced by other records', data: null };
      }
    }

    return { error: 'Failed to delete item', data: null };
  }
}

export async function upsertDiscountToItem(input: z.infer<typeof upsertDiscountSchema>) {
  const session = await auth(); // Obtém a sessão de autenticação

  // Verifica se o usuário está autenticado
  if (!session?.user?.id) {
    return {
      error: 'Not authorized', // Retorna um erro se não estiver autenticado
      data: null,
    };
  }

  // Se um ID de desconto for fornecido, atualiza o desconto existente
  if (input.discountId) {
    // Verifica se o desconto existe e está associado ao item correto
    const discount = await prisma.discount.findUnique({
      where: {
        id: input.discountId,
        itemId: input.itemId,
      },
      select: {
        id: true, // Seleciona apenas o ID do desconto
      },
    });

    // Retorna um erro se o desconto não for encontrado
    if (!discount) {
      return {
        error: 'Discount not found for this item',
        data: null,
      };
    }

    // Atualiza o desconto com os novos dados
    const updatedDiscount = await prisma.discount.update({
      where: {
        id: input.discountId,
      },
      data: {
        newPrice: input.newPrice, // Atualiza o novo preço
        expiration: input.expiration ?? new Date('9999-12-31T23:59:59.999Z'), // Atualiza a data de expiração ou usa o valor padrão
      },
    });

    return {
      error: null,
      data: updatedDiscount, // Retorna o desconto atualizado
    };
  } else {
    // Se nenhum ID de desconto for fornecido, cria um novo desconto
    // Primeiro, verifica se o item já possui um desconto associado
    const existingDiscount = await prisma.discount.findUnique({
      where: {
        itemId: input.itemId,
      },
      select: {
        id: true,
      },
    });

    if (existingDiscount) {
      return {
        error: 'Item already has a discount',
        data: null,
      };
    }

    // Cria um novo desconto para o item
    const newDiscount = await prisma.discount.create({
      data: {
        itemId: input.itemId, // Associa o desconto ao item
        newPrice: input.newPrice, // Define o novo preço
        expiration: input.expiration ?? new Date('9999-12-31T23:59:59.999Z'), // Define a data de expiração ou usa o valor padrão
      },
    });

    return {
      error: null,
      data: newDiscount, // Retorna o desconto criado
    };
  }
}

export async function deleteDiscountById(discountId: string) {
  const session = await auth(); // Obtém a sessão de autenticação

  // Verifica se o usuário está autenticado
  if (!session?.user?.id) {
    return {
      error: 'Not authorized', // Retorna um erro se o usuário não estiver autenticado
      data: null,
    };
  }

  // Verifica se o ID do desconto foi fornecido
  if (!discountId) {
    return {
      error: 'Discount ID is required', // O ID do desconto é necessário para deletar um desconto
      data: null,
    };
  }

  // Verifica se o desconto existe
  const existingDiscount = await prisma.discount.findUnique({
    where: {
      id: discountId,
    },
    select: {
      id: true, // Seleciona apenas o ID do desconto
    },
  });

  // Retorna um erro se o desconto não for encontrado
  if (!existingDiscount) {
    return {
      error: 'Discount not found', // Retorna um erro se o desconto não existir
      data: null,
    };
  }

  // Deleta o desconto
  await prisma.discount.delete({
    where: {
      id: discountId,
    },
  });

  return {
    error: null,
    data: 'Discount successfully deleted', // Retorna uma mensagem de sucesso
  };
}