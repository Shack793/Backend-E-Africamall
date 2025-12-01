import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsBoolean, 
  Min, 
  IsUrl,
  MinLength,
  MaxLength 
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ 
    example: 'Updated Product Name', 
    description: 'Product name',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;

  @ApiProperty({ 
    example: 'Updated product description with more details...', 
    description: 'Product description',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ 
    example: 129.99, 
    description: 'Product price',
    required: false,
    minimum: 0 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ 
    example: 'https://example.com/images/updated-product.jpg', 
    description: 'Product image URL',
    required: false 
  })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiProperty({ 
    example: 50, 
    description: 'Product stock quantity',
    required: false,
    minimum: 0 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ 
    example: true, 
    description: 'Whether product is featured',
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ 
    example: 2, 
    description: 'Category ID',
    required: false 
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'Vendor ID',
    required: false 
  })
  @IsOptional()
  @IsString()
  vendorId?: string;
}