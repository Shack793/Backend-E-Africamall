import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity' })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Product variation ID', required: false })
  @IsOptional()
  @IsString()
  variationId?: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'Order items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Shipping address ID' })
  @IsString()
  @IsNotEmpty()
  shippingAddressId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Payment method ID', required: false })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiProperty({ example: 'FREE_SHIPPING', description: 'Coupon code', required: false })
  @IsOptional()
  @IsString()
  couponCode?: string;
}