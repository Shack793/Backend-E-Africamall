import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../../../entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    example: 'processing', 
    description: 'Order status',
    enum: OrderStatus,
    required: false 
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;


  @ApiProperty({ 
    example: 'Order is being processed', 
    description: 'Admin notes',
    required: false 
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
    paymentStatus: any;
}