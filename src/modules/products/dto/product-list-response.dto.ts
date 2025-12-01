import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

export class ProductListResponseDto {
  @ApiProperty({ type: [ProductResponseDto], description: 'List of products' })
  products: ProductResponseDto[];

  @ApiProperty({ example: 100, description: 'Total number of products' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Whether there are more pages' })
  hasNext: boolean;

  @ApiProperty({ example: false, description: 'Whether there are previous pages' })
  hasPrev: boolean;

  @ApiProperty({ example: { minPrice: 10, maxPrice: 1000 }, description: 'Available filters', required: false })
  filters?: any;
}