import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise';
import { getUserTodos } from './actions';

export type Todo = {
  id: string;
  title: string;
  userId: string;
  doneAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

// Discount Interface
export interface Discount {
  id: string;
  itemId: string;
  newPrice: string;
  expiration: Date | null | string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Item Interface
export interface Item {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isVegan: boolean;
  isAvailable: boolean;
  categoryId: string;
  discount?: Discount | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Item Category Interface
export interface ItemCategory {
  id: string;
  name: string;
  items: Item[];
  isEditing?: boolean; // Caso seja utilizado na sua interface
  isExpanded?: boolean
}

// Opening Hours Interface
export interface OpeningHours {
  id: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  restaurantId: string;
}

// Restaurant Interface
export interface RestaurantData {
  id: string;
  name: string;
  colorThemeCode: string;
  address: string;
  contactNumber: string;
  instagramProfileName: string;
  doDelivery: boolean;
  doOrder: boolean;
  deliveryFee: string;
  deliveryTimeMinutes: string;
  avatarUrl: string;
  openingHours: OpeningHours[];
  itemCategories: ItemCategory[];
}

// Order Item Interface
export interface OrderItem {
  id: string;
  amount: string;
  itemId: string;
  orderId: string;
  item: Item;
}

// Order Interface
export interface Order {
  id: string;
  identifier: string;
  status: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  clientName?: string;
  orderType: string;
  totalPrice: string;
  table?: string;
  trackingCode: string;
  clientContact?: string;
  clientAddress?: string;
  orderItems: OrderItem[];
}
