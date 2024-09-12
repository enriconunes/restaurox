'use server'

import { prisma } from '@/services/database' // Importa o serviço de banco de dados Prisma
import { Prisma } from '@prisma/client'
import { auth } from '@/services/auth' // Importe a função de autenticação conforme necessário
import { startOfDay, endOfDay } from 'date-fns'

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
      createdAt: {
        gte: filters.startDate ? startOfDay(filters.startDate) : undefined,
        lte: filters.endDate ? endOfDay(filters.endDate) : undefined,
      },
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
      const date = new Date(order.createdAt.toISOString().split('T')[0]);
      const revenue = parseFloat(order.totalPrice);
      const existingDay = acc.find(day => day.date.getTime() === date.getTime());
      if (existingDay) {
        existingDay.revenue += revenue;
      } else {
        acc.push({ date, revenue });
      }
      return acc;
    }, [] as Array<{ date: Date; revenue: number }>).sort((a, b) => a.date.getTime() - b.date.getTime());

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

    const customerRetention = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt.toISOString().split('T')[0]);
      const existingDay = acc.find(day => day.date.getTime() === date.getTime());
      if (existingDay) {
        if (acc.some(day => day.date < order.createdAt && day.customers.includes(order.clientContact!))) {
          existingDay.returningCustomers++;
        } else {
          existingDay.newCustomers++;
        }
        existingDay.customers.push(order.clientContact!);
      } else {
        acc.push({ 
          date, 
          newCustomers: 1, 
          returningCustomers: 0,
          customers: [order.clientContact!]
        });
      }
      return acc;
    }, [] as Array<{ date: Date; newCustomers: number; returningCustomers: number; customers: string[] }>)
    .map(({ date, newCustomers, returningCustomers }) => ({ date, newCustomers, returningCustomers }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

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