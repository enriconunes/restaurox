import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'
import { getUserTodos } from './actions'

export type Todo = {
    id: string;
    title: string;
    userId: string;
    doneAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// File: app/types.ts (or wherever you keep your type definitions)

export interface Item {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isVegan: boolean;
  isAvailable: boolean;
  categoryId: string;
}

export interface ItemCategory {
  id: string;
  name: string;
  items: Item[];
  isEditing?: boolean; // Add this if you're using it in your component
}

export interface RestaurantData {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  instagramProfileName: string;
  doDelivery: boolean;
  deliveryFee: string;
  deliveryTimeMinutes: string;
  avatarUrl: string;
  itemCategories: ItemCategory[];
}