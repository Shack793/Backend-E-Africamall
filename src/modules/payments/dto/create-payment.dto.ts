import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsNotEmpty, IsString, IsOptional, Min } from 'class-validator';
import { PaymentMethod } from '../../../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({ example: 'ORD-2024-001', description: 'Order ID' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ 
    example: 'credit_card', 
    description: 'Payment method',
    enum: PaymentMethod 
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @ApiProperty({ example: 199.99, description: 'Payment amount' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ 
    example: 'tok_visa', 
    description: 'Payment token (for card payments)',
    required: false 
  })
  @IsOptional()
  @IsString()
  paymentToken?: string;

  @ApiProperty({ 
    example: '{"card": {"last4": "4242"}}', 
    description: 'Payment metadata',
    required: false 
  })
  @IsOptional()
  @IsString()
  metadata?: string;
}