'use server'

import { nanoid } from 'nanoid';
import { prisma } from '@/services/database' // Importa o serviço de banco de dados Prisma

export const getRestaurantDetailsById = async (idRestaurant: string) => {
  try {
    // Busca o restaurante pelo id fornecido
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: idRestaurant,
      },
      include: {
        openingHours: true, // Incluir horários de abertura
        itemCategories: {
          include: {
            items: {
              where: {
                deletedAt: null, // Filtrar apenas itens não deletados logicamente
              },
              include: {
                discount: true, // Incluir informações de desconto para cada item
              },
            },
          },
        },
      },
    });

    if (!restaurant) {
      return {
        error: 'Restaurante não encontrado',
        data: null,
      };
    }

    return {
      error: null, // Nenhum erro ocorreu
      data: restaurant, // Dados do restaurante com horários e categorias
    };
  } catch (error) {
    console.error('Erro ao obter detalhes do restaurante:', error);

    return {
      error: 'Falha ao obter detalhes do restaurante',
      data: null,
    };
  }
};

// Função para criar um novo pedido (Order)
export async function createNewOrder(input: {
  restaurantId: string;
  clientName?: string;
  note?: string;
  orderType: string;
  totalPrice: string;
  table?: string;
  clientContact?: string;
  clientAddress?: string;
  items: {
    itemId: string;
    amount: string;
  }[];
}) {
  // Inicia uma transação para garantir consistência
  return await prisma.$transaction(async (prisma) => {
    // Verifica se o restaurante existe
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: input.restaurantId },
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    // Encontra o maior identifier de pedidos anteriores para o restaurante
    const orders = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            item: {
              category: {
                restaurantId: input.restaurantId,
              },
            },
          },
        },
      },
      select: {
        identifier: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Pega os últimos 100 pedidos para garantir
    });

    console.log("Últimos pedidos:", orders);

    // Encontra o maior identificador
    const lastIdentifier = orders.reduce((max, order) => {
      const current = parseInt(order.identifier, 10);
      return current > max ? current : max;
    }, 0);

    const nextIdentifier = lastIdentifier + 1;

    console.log("Último identificador:", lastIdentifier);
    console.log("Próximo identificador:", nextIdentifier);

    // Verifica se há itens fornecidos
    if (input.items.length === 0) {
      throw new Error('At least one item is required to create an order');
    }

    // Valida se os itens existem
    for (const orderItem of input.items) {
      const itemExists = await prisma.item.findUnique({
        where: { id: orderItem.itemId },
      });

      if (!itemExists) {
        throw new Error(`Item with ID ${orderItem.itemId} not found`);
      }
    }

    const trackingCode = nanoid(6); // Código de rastreio curto e único

    // Cria o pedido (Order) no banco de dados
    const newOrder = await prisma.order.create({
      data: {
        identifier: String(nextIdentifier),
        status: 'pending', // Status inicial do pedido
        note: input.note || null,
        clientName: input.clientName || null,
        orderType: input.orderType,
        totalPrice: input.totalPrice,
        table: input.table || null,
        clientContact: input.clientContact || null,
        clientAddress: input.clientAddress || null,
        trackingCode, // Adiciona o código de rastreio ao pedido
        orderItems: {
          create: input.items.map((orderItem) => ({
            amount: orderItem.amount,
            itemId: orderItem.itemId,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    console.log("Novo pedido criado:", newOrder);

    return {
      error: null,
      data: newOrder, // Retorna o pedido criado
    };
  });
}

// rastrear estado da order
export async function getOrderByTrackingCode(trackingCode: string) {
  // Verifica se o código de rastreio foi fornecido
  if (!trackingCode) {
    return {
      error: 'Tracking code is required',
      data: null,
    };
  }

  // Busca pedidos com base no código de rastreio
  const orders = await prisma.order.findMany({
    where: { trackingCode },
    orderBy: {
      createdAt: 'desc', // Ordena pela data de criação mais recente
    },
    include: {
      orderItems: {
        include: {
          item: true, // Inclui os detalhes dos itens no pedido
        },
      },
    },
  });

  // Se não encontrar nenhum pedido, retorna erro
  if (orders.length === 0) {
    return {
      error: 'Order not found',
      data: null,
    };
  }

  // Retorna o pedido mais recente
  const latestOrder = orders[0];

  return {
    error: null,
    data: latestOrder, // Retorna o pedido encontrado
  };
}
