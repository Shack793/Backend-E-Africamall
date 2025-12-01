import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class RefundPaymentDto {
  @ApiProperty({ 
    example: 50.00, 
    description: 'Refund amount (partial refund)',
    required: false 
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiProperty({ 
    example: 'Customer requested refund', 
    description: 'Refund reason',
    required: false 
  })
  @IsOptional()
  @IsString()
  reason?: string;
}