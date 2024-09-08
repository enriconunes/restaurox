'use server'

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
