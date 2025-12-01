// product-response.dto.ts
export class ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  isFeatured: boolean;
  categoryId?: number;
  vendorId?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: number;
    name: string;
    description?: string;
    image?: string;
  };
  vendor?: {
    id: string;
    name: string;
    email: string;
    isApproved: boolean;
  };
  variations?: Array<{
    id: number;
    name: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  reviews?: Array<{
    id: number;
    rating: number;
    comment?: string;
    createdAt: Date;
  }>;
}