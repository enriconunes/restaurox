'use server'

import { prisma } from "@/services/database";

interface UpdatedInfo {
    avatarUrl: string;
    // id: string;
    name: string;
    address: string;
    contactNumber: string;
    instagramProfileName: string;
    doDelivery: boolean;
    deliveryFee: string;
    deliveryTimeMinutes: string;
    // colorThemeCode: string;
    // openingHours: Array<{
    //     id: string;
    //     dayOfWeek: string;
    //     openTime: string;
    //     closeTime: string;
    //     isOpen: boolean;
    //     restaurantId: string;
    // }>;
}

// atalizar informacoes do restaurante
// funcao usada em edit-main-restaurant-details.tsx
export const updateRestaurantDetailsByRestaurantId = async (
  restaurantId: string, // Atualizado para receber o ID do restaurante
  updatedInfo: UpdatedInfo
) => {
  try {
    // Verificar se o restaurante existe
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: restaurantId, // Usando o ID do restaurante passado como parâmetro
      },
    });

    // Se o restaurante não for encontrado, retornar um erro
    if (!restaurant) {
      return {
        error: `Restaurante com o ID ${restaurantId} não encontrado.`,
        data: null,
      };
    }

    // Atualizar o restaurante com as novas informações
    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id: restaurantId, // Usando o ID do restaurante passado como parâmetro
      },
      data: {
        name: updatedInfo.name,
        address: updatedInfo.address,
        contactNumber: updatedInfo.contactNumber,
        instagramProfileName: updatedInfo.instagramProfileName,
        deliveryFee: updatedInfo.deliveryFee,
        deliveryTimeMinutes: updatedInfo.deliveryTimeMinutes,
        doDelivery: updatedInfo.doDelivery,
        avatarUrl: updatedInfo.avatarUrl,
      },
    });

    console.log('restaurante atualizado')

    return {
      error: null, // Nenhum erro ocorreu
      data: updatedRestaurant, // Dados do restaurante atualizado
    };
  } catch (error) {
    console.error('Erro ao atualizar os detalhes do restaurante:', error);

    console.log("Houve um erro: ", error)

    return {
      error: 'Falha ao atualizar os detalhes do restaurante',
      data: null,
    };
  }
};



export const getMainRestaurantDescriptionByIdUser = async (idUser: string) => {
  try {
    // Buscar o primeiro restaurante associado ao idUser, incluindo o colorThemeCode e os horários de funcionamento
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: idUser,
      },
      select: {
        id: true,
        name: true,
        address: true,
        contactNumber: true,
        instagramProfileName: true,
        doDelivery: true,
        deliveryFee: true,
        deliveryTimeMinutes: true,
        avatarUrl: true,
        colorThemeCode: true,
        openingHours: true, // Incluir os horários de funcionamento
      },
    });

    // Verificar se o restaurante foi encontrado
    if (!restaurant) {
      return {
        error: `Nenhum restaurante encontrado para o usuário com o ID: ${idUser}.`,
        data: null,
      };
    }

    return {
      error: null, // Nenhum erro ocorreu
      data: restaurant, // Dados do restaurante encontrado
    };
  } catch (error) {
    console.error('Erro ao obter a descrição principal do restaurante:', error);

    return {
      error: 'Falha ao obter a descrição principal do restaurante',
      data: null,
    };
  }
};