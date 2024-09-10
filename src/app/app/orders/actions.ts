'use server'

import { z } from 'zod';
import { prisma } from '@/services/database' // Importa o serviço de banco de dados Prisma
import { Order } from '../(main)/types';
import { auth } from '@/services/auth' // Importe a função de autenticação conforme necessário

type OrderFilters = {
  userId: string;
  orderType?: 'delivery' | 'dine-in';
  identifier?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  status?: string;
  page?: number;
  pageSize?: number;
}

export const getOrdersByUserId = async ({
  userId,
  orderType,
  identifier,
  startDate,
  endDate,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  status,
  page = 1,
  pageSize = 10
}: OrderFilters) => {
  try {
    console.log('Iniciando busca de pedidos para o usuário:', userId);

    const restaurant = await prisma.restaurant.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!restaurant) {
      console.log('Restaurante não encontrado para o usuário:', userId);
      return {
        error: 'Restaurante não encontrado para este usuário',
        data: null,
        totalCount: 0,
      };
    }

    console.log('Restaurante encontrado:', restaurant.id);

    const where: any = {
      orderItems: {
        some: {
          item: {
            category: {
              restaurantId: restaurant.id
            }
          }
        }
      }
    };

    if (orderType) where.orderType = orderType;
    if (identifier) where.identifier = { contains: identifier };
    if (status) where.status = status;
    if (startDate) where.createdAt = { ...where.createdAt, gte: startDate };
    if (endDate) where.createdAt = { ...where.createdAt, lte: endDate };

    console.log('Filtros aplicados:', where);

    const totalCount = await prisma.order.count({ where });
    console.log('Total de pedidos encontrados:', totalCount);

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            item: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    console.log(`${orders.length} pedidos recuperados para a página ${page}`);

    return {
      error: null,
      data: orders as Order[],
      totalCount,
    };
  } catch (error) {
    console.error('Erro detalhado ao obter pedidos:', error);
    return {
      error: 'Falha ao obter pedidos: ' + (error instanceof Error ? error.message : String(error)),
      data: null,
      totalCount: 0,
    };
  }
}

// Validação de entrada para atualizar o status de um pedido
const updateOrderStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'canceled', 'confirmed', 'done']),
});

export async function updateOrderStatus(input: z.infer<typeof updateOrderStatusSchema>) {
  const session = await auth(); // Obtenha a sessão de autenticação

  // Verifique se o usuário está autenticado
  if (!session?.user?.id) {
    return {
      error: 'Not authorized', // Retorne um erro se não estiver autenticado
      data: null,
    };
  }

  // Verifique se o ID do pedido foi fornecido
  if (!input.id) {
    return {
      error: 'Order ID is required', // O ID do pedido é necessário para atualizar o status
      data: null,
    };
  }

  // Verifique se o pedido existe
  const existingOrder = await prisma.order.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true, // Selecione apenas o ID do pedido
    },
  });

  // Retorne um erro se o pedido não for encontrado
  if (!existingOrder) {
    return {
      error: 'Order not found',
      data: null,
    };
  }

  // Atualize o status do pedido
  const updatedOrder = await prisma.order.update({
    where: {
      id: input.id,
    },
    data: {
      status: input.status,
    },
  });

  return {
    error: null,
    data: updatedOrder, // Retorne o pedido atualizado
  };
}