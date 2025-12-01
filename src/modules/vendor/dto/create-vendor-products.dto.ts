import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsBoolean, 
  Min, 
  Max, 
  MinLength, 
  MaxLength,
  IsUrl
} from 'class-validator';

export class CreateVendorProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Bluetooth Headphones',
    minLength: 2,
    maxLength: 200
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality wireless headphones with noise cancellation',
    maxLength: 1000
  })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 99.99,
    minimum: 0.01
  })
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/headphones.jpg'
  })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiProperty({
    description: 'Product stock quantity',
    example: 50,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Whether the product is featured',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}