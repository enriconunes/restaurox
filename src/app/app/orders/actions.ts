'use server'

import { z } from 'zod';
import { prisma } from '@/services/database' // Importa o serviço de banco de dados Prisma
import { Prisma } from '@prisma/client'
import { Order } from '../(main)/types';
import { auth } from '@/services/auth' // Importe a função de autenticação conforme necessário
import { endOfDay } from 'date-fns'

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

type MetricsFilters = {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  orderType?: 'delivery' | 'dine-in';
  category?: string;
}

type Metrics = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: Array<{ itemId: string; name: string; totalSold: number }>;
  dailyRevenue: Array<{ date: Date; revenue: number }>;
  categorySales: Array<{ categoryId: string; name: string; totalSales: number }>;
  popularHours: Array<{ hour: number; orderCount: number }>;
  customerRetention: Array<{ date: Date; newCustomers: number; returningCustomers: number }>;
  categories: Array<{ id: string; name: string }>;
  orderTypeDistribution: Array<{ orderType: string; count: number }>;
}

export const getRestaurantMetrics = async (filters: MetricsFilters): Promise<{ error: string | null; data: Metrics | null }> => {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId: filters.userId },
      select: { id: true }
    });

    if (!restaurant) {
      return { error: 'Restaurante não encontrado para este usuário', data: null };
    }

    const where: Prisma.OrderWhereInput = {
      orderItems: {
        some: {
          item: {
            category: {
              restaurantId: restaurant.id
            }
          }
        }
      },
      ...(filters.startDate && { createdAt: { gte: filters.startDate } }),
      ...(filters.endDate && { createdAt: { lte: endOfDay(filters.endDate) } }),
      ...(filters.orderType && { orderType: filters.orderType }),
      ...(filters.category && {
        orderItems: {
          some: {
            item: {
              categoryId: filters.category
            }
          }
        }
      })
    };

    const [
      orders,
      topSellingItemsRaw,
      categorySales,
      categories,
      orderTypeDistribution
    ] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          id: true,
          totalPrice: true,
          createdAt: true,
          clientContact: true,
          orderType: true
        }
      }),
      prisma.orderItem.groupBy({
        by: ['itemId'],
        where: { order: where },
        _count: { amount: true },
        orderBy: { _count: { amount: 'desc' } },
        take: 5,
      }),
      prisma.itemCategory.findMany({
        where: { restaurantId: restaurant.id },
        select: {
          id: true,
          name: true,
          items: {
            select: {
              orderItems: {
                where: { order: where },
                select: { amount: true }
              }
            }
          }
        }
      }),
      prisma.itemCategory.findMany({
        where: { restaurantId: restaurant.id },
        select: { id: true, name: true }
      }),
      prisma.order.groupBy({
        by: ['orderType'],
        where,
        _count: {
          _all: true
        }
      })
    ]);

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const dailyRevenue = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const revenue = parseFloat(order.totalPrice);
      const existingDay = acc.find(day => day.date.toISOString().split('T')[0] === date);
      if (existingDay) {
        existingDay.revenue += revenue;
      } else {
        acc.push({ date: order.createdAt, revenue });
      }
      return acc;
    }, [] as Array<{ date: Date; revenue: number }>);

    // Fetch item names for top selling items
    const itemIds = topSellingItemsRaw.map(item => item.itemId);
    const itemsWithNames = await prisma.item.findMany({
      where: { id: { in: itemIds } },
      select: { id: true, name: true }
    });

    const topSellingItems = topSellingItemsRaw.map(item => {
      const itemWithName = itemsWithNames.find(i => i.id === item.itemId);
      return {
        itemId: item.itemId,
        name: itemWithName?.name || 'Item Desconhecido',
        totalSold: item._count.amount
      };
    });

    // Calculate popular hours
    const popularHours = orders.reduce((acc, order) => {
      const hour = order.createdAt.getHours();
      const existingHour = acc.find(h => h.hour === hour);
      if (existingHour) {
        existingHour.orderCount++;
      } else {
        acc.push({ hour, orderCount: 1 });
      }
      return acc;
    }, [] as Array<{ hour: number; orderCount: number }>).sort((a, b) => b.orderCount - a.orderCount);

    // Calculate customer retention
    const customerRetention = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      const existingDay = acc.find(day => day.date.toISOString().split('T')[0] === date);
      if (existingDay) {
        if (acc.some(day => day.date < order.createdAt && day.customers.includes(order.clientContact!))) {
          existingDay.returningCustomers++;
        } else {
          existingDay.newCustomers++;
        }
        existingDay.customers.push(order.clientContact!);
      } else {
        acc.push({ 
          date: order.createdAt, 
          newCustomers: 1, 
          returningCustomers: 0,
          customers: [order.clientContact!]
        });
      }
      return acc;
    }, [] as Array<{ date: Date; newCustomers: number; returningCustomers: number; customers: string[] }>)
    .map(({ date, newCustomers, returningCustomers }) => ({ date, newCustomers, returningCustomers }));

    const metrics: Metrics = {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      topSellingItems,
      dailyRevenue,
      categorySales: categorySales.map(category => ({
        categoryId: category.id,
        name: category.name,
        totalSales: category.items.reduce((sum, item) => 
          sum + item.orderItems.reduce((itemSum, orderItem) => 
            itemSum + parseInt(orderItem.amount, 10), 0
          ), 0
        )
      })),
      popularHours,
      customerRetention,
      categories,
      orderTypeDistribution: orderTypeDistribution.map(type => ({
        orderType: type.orderType,
        count: type._count._all
      }))
    };

    return { error: null, data: metrics };
  } catch (error) {
    console.error('Erro ao obter métricas:', error);
    return {
      error: 'Falha ao obter métricas: ' + (error instanceof Error ? error.message : String(error)),
      data: null
    };
  }
}