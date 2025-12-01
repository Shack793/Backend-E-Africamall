import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsBoolean, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @ApiProperty({ 
    example: 1, 
    description: 'Page number',
    required: false,
    default: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ 
    example: 10, 
    description: 'Number of items per page',
    required: false,
    default: 10 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ 
    example: 1, 
    description: 'Filter by category ID',
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'Filter by vendor ID',
    required: false 
  })
  @IsOptional()
  @IsString()
  vendorId?: string;

  @ApiProperty({ 
    example: 10, 
    description: 'Minimum price',
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({ 
    example: 100, 
    description: 'Maximum price',
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({ 
    example: 'laptop', 
    description: 'Search term for product name or description',
    required: false 
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    example: true, 
    description: 'Filter by featured status',
    required: false 
  })
  @IsOptional()
  @Type(() => Boolean) 
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ 
    example: true, 
    description: 'Filter by in-stock status',
    required: false 
  })
  @IsOptional()
  @Type(() => Boolean) 
  @IsBoolean()
  inStock?: boolean;

  @ApiProperty({ 
    example: 'name', 
    description: 'Sort field',
    required: false,
    enum: ['name', 'price', 'createdAt', 'updatedAt', 'stock'] 
  })
  @IsOptional()
  @IsEnum(['name', 'price', 'createdAt', 'updatedAt', 'stock'])
  sortBy?: string = 'createdAt';

  @ApiProperty({ 
    example: 'DESC', 
    description: 'Sort order',
    required: false,
    enum: ['ASC', 'DESC'] 
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}