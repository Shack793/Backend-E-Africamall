import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class ProcessPaymentDto {
  @ApiProperty({ example: 'pay_1ABCdefGHIjklMNopQRSTuvw', description: 'Payment intent ID' })
  @IsString()
  @IsNotEmpty()
  paymentIntentId: string;

  @ApiProperty({ 
    example: 'pi_1ABCdefGHIjklMNopQRSTuvw', 
    description: 'Stripe payment intent ID',
    required: false 
  })
  @IsOptional()
  @IsString()
  stripePaymentIntentId?: string;

  @ApiProperty({ 
    example: '{"payment_method": "pm_1ABCdefGHIjklMNopQRSTuvw"}', 
    description: 'Payment method details',
    required: false 
  })
  @IsOptional()
  @IsObject()
  paymentMethod?: any;
}