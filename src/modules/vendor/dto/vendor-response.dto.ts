export class VendorResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  description?: string;
  logo?: string;
  website?: string;
  isApproved: boolean;
  isActive: boolean;
  rating: number;
  totalProducts: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    role: string; 

  };
  products: Array<{
    id: number;
    name: string;
    price: number;
    stock: number;
    isFeatured: boolean;
    image?: string;
  }>;
}