import { prisma } from "@/services/database";

// função chamada ao criar um novo user no callback do auth
// ao criar um novo user, cria um registro de Restaurant para ele
// e cria registros referentes aos horarios de funcionamento do/para Restaurant criado
// é usado uma transação para garantir que essas duas operações funcionarão em conjunto
export const setupNewClientModels = async (idUser: string) => {
  try {
    // Inicia a transação do Prisma
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Cria um novo Restaurant para o usuário fornecido
      const newRestaurant = await prisma.restaurant.create({
        data: {
          userId: idUser,
          // os demais campos são default pelo schema
        },
      });

      // 2. Cria 7 registros de OpeningHours para o novo Restaurant
      const openingHoursData = [
        { dayOfWeek: 'Segunda-feira', restaurantId: newRestaurant.id },
        { dayOfWeek: 'Terça-feira', restaurantId: newRestaurant.id },
        { dayOfWeek: 'Quarta-feira', restaurantId: newRestaurant.id },
        { dayOfWeek: 'Quinta-feira', restaurantId: newRestaurant.id },
        { dayOfWeek: 'Sexta-feira', restaurantId: newRestaurant.id },
        { dayOfWeek: 'Sábado', restaurantId: newRestaurant.id },
        { dayOfWeek: 'Domingo', restaurantId: newRestaurant.id },
      ];

      const newOpeningHours = await prisma.openingHours.createMany({
        data: openingHoursData,
      });

      return { newRestaurant, newOpeningHours };
    });

    return {
      error: null, // Nenhum erro ocorreu
      data: result, // Dados da transação bem-sucedida
    };
  } catch (error) {
    console.error('Erro ao criar modelos para o novo cliente:', error);

    return {
      error: 'Falha ao criar modelos para o novo cliente',
      data: null,
    };
  }
};