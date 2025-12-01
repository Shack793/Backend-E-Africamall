import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 99.99, description: 'Unit price', required: false })
  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto], description: 'Order items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'Credit Card', description: 'Payment method' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ example: '123 Main St, City, Country', description: 'Shipping address' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({ example: '123 Main St, City, Country', description: 'Billing address', required: false })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiProperty({ example: 'Please deliver after 5 PM', description: 'Customer notes', required: false })
  @IsOptional()
  @IsString()
  customerNotes?: string;

  @ApiProperty({ example: 'FREE10', description: 'Coupon code', required: false })
  @IsOptional()
  @IsString()
  couponCode?: string;
}