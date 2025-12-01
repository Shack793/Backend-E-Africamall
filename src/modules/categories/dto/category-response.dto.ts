import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 1, description: 'Category ID' })
  id: number;

  @ApiProperty({ example: 'Electronics', description: 'Category name' })
  name: string;

  @ApiProperty({ 
    example: 'Electronic devices and accessories', 
    description: 'Category description',
    required: false 
  })
  description?: string;

  @ApiProperty({ 
    example: 'electronics.jpg', 
    description: 'Category image URL',
    required: false 
  })
  image?: string;


  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 15, description: 'Number of products in this category', required: false })
  productCount?: number;
}