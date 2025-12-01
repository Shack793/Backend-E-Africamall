import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsNotEmpty, 
  IsOptional, 
  IsBoolean, 
  Min, 
  IsUrl,
  MinLength,
  MaxLength 
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ 
    example: 'Smartphone X', 
    description: 'Product name' 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ 
    example: 'Latest smartphone with advanced features and high-resolution camera', 
    description: 'Product description' 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @ApiProperty({ 
    example: 999.99, 
    description: 'Product price',
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ 
    example: 'https://example.com/images/smartphone-x.jpg', 
    description: 'Product image URL',
    required: false 
  })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiProperty({ 
    example: 50, 
    description: 'Product stock quantity',
    minimum: 0,
    default: 0 
  })
  @IsNumber()
  @Min(0)
  stock: number = 0;

  @ApiProperty({ 
    example: false, 
    description: 'Whether product is featured',
    required: false,
    default: false 
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

  @ApiProperty({ 
    example: 1, 
    description: 'Category ID' 
  })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ 
    example: '550e8400-e29b-41d4-a716-446655440000', 
    description: 'Vendor ID' 
  })
  @IsString()
  vendorId: string;
}