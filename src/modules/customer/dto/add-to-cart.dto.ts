import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity to add to cart', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Product variation ID', required: false })
  @IsOptional()
  @IsString()
  variationId?: string;
}