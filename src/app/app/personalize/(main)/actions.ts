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
    doOrder: boolean;
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
        doOrder: updatedInfo.doOrder,
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

// obter descricoes principais do restaurante a partir do id do user
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
        doOrder: true,
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

// obter horarios de funcionamento do restaurante atraves do id do user
export const getOpeningHoursByIdUser = async (idUser: string) => {
  try {
    // Buscar o primeiro restaurante associado ao idUser, incluindo apenas os horários de funcionamento
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: idUser,
      },
      select: {
        openingHours: true, // Selecionar apenas os horários de funcionamento
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
      data: restaurant.openingHours, // Retornar apenas os horários de funcionamento do restaurante encontrado
    };
  } catch (error) {
    console.error('Erro ao obter os horários de funcionamento do restaurante:', error);

    return {
      error: 'Falha ao obter os horários de funcionamento do restaurante',
      data: null,
    };
  }
};

type OpeningHoursUpdateData = {
  dayOfWeek: string; // Dia da semana, como "Segunda-feira"
  isOpen: boolean;   // Se o restaurante está aberto ou fechado
  openTime: string;  // Hora de abertura no formato "HH:MM"
  closeTime: string; // Hora de fechamento no formato "HH:MM"
};

// atualizar os horarios de funcionamento do restaurante
export const updateOperatingHours = async (idUser: string, openingHoursData: OpeningHoursUpdateData[]) => {
  try {
    // Buscar o primeiro restaurante associado ao idUser
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: idUser,
      },
      select: {
        id: true, // Obter o ID do restaurante
      },
    });

    // Verificar se o restaurante foi encontrado
    if (!restaurant) {
      return {
        error: `Nenhum restaurante encontrado para o usuário com o ID: ${idUser}.`,
        data: null,
      };
    }

    // Preparar as operações de atualização
    const updateOperations = openingHoursData.map((openingHour) =>
      prisma.openingHours.updateMany({
        where: {
          restaurantId: restaurant.id,
          dayOfWeek: openingHour.dayOfWeek,
        },
        data: {
          isOpen: openingHour.isOpen,
          openTime: openingHour.openTime,
          closeTime: openingHour.closeTime,
        },
      })
    );

    // Executar todas as operações de atualização em uma transação
    await prisma.$transaction(updateOperations);

    return {
      error: null,
      data: 'Horários de funcionamento atualizados com sucesso.',
    };
  } catch (error) {
    console.error('Erro ao atualizar os horários de funcionamento do restaurante:', error);

    return {
      error: 'Falha ao atualizar os horários de funcionamento do restaurante',
      data: null,
    };
  }
};

export const getRestaurantColorThemeByIdUser = async (idUser: string) => {
  try {
    // Buscar o primeiro restaurante associado ao idUser, incluindo apenas o colorThemeCode
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: idUser,
      },
      select: {
        colorThemeCode: true, // Selecionar apenas o colorThemeCode
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
      data: restaurant.colorThemeCode, // Retornar apenas o colorThemeCode do restaurante encontrado
    };
  } catch (error) {
    console.error('Erro ao obter o tema de cor do restaurante:', error);

    return {
      error: 'Falha ao obter o tema de cor do restaurante',
      data: null,
    };
  }
};

export const updateRestaurantColorTheme = async (idUser: string, newColor: string) => {
  try {
    // Buscar o primeiro restaurante associado ao idUser
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: idUser,
      },
    });

    // Verificar se o restaurante foi encontrado
    if (!restaurant) {
      return {
        error: `Nenhum restaurante encontrado para o usuário com o ID: ${idUser}.`,
        data: null,
      };
    }

    // Atualizar o tema de cor do restaurante
    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id: restaurant.id,
      },
      data: {
        colorThemeCode: newColor, // Atualizar o campo colorThemeCode com a nova cor
      },
    });

    return {
      error: null, // Nenhum erro ocorreu
      data: updatedRestaurant.colorThemeCode, // Retornar o novo tema de cor do restaurante atualizado
    };
  } catch (error) {
    console.error('Erro ao atualizar o tema de cor do restaurante:', error);

    return {
      error: 'Falha ao atualizar o tema de cor do restaurante',
      data: null,
    };
  }
};