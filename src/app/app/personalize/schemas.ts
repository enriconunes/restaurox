import { z } from 'zod';

export const updateRestaurantSchema = z.object({
  name: z.string().min(1, { message: "O nome do restaurante é obrigatório" }),
  address: z.string().min(1, { message: "O endereço é obrigatório" }),
  contactNumber: z.string(),
  instagramProfileName: z.string(),
  deliveryFee: z.string(),
  deliveryTimeMinutes: z.string(),
  doDelivery: z.boolean(),
  avatarUrl: z.string(),
});
