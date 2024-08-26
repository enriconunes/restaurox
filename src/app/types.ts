// app/types.ts
export interface RestaurantData {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  instagramProfileName: string;
  doDelivery: boolean;
  avatarUrl: string;
  coverUrl: string;
  colorThemeCode: string;
  openingHours: {
    id: string;
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }[];
  itemCategories: {
    id: string;
    name: string;
    items: {
      id: string;
      name: string;
      description: string;
      price: string;
      imageUrl: string;
    }[];
  }[];
}
