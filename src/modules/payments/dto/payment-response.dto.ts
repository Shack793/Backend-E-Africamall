import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '../../../entities/payment.entity';

export class PaymentResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Payment ID' })
  id: string;

  @ApiProperty({ example: 199.99, description: 'Payment amount' })
  amount: number;

  @ApiProperty({ example: 'credit_card', description: 'Payment method', enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty({ example: 'pending', description: 'Payment status', enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ example: 'txn_123456', description: 'Transaction ID', required: false })
  transactionId?: string;

  @ApiProperty({ example: 'stripe', description: 'Payment gateway' })
  paymentGateway: string;

  @ApiProperty({ example: 'pi_1ABCdefGHIjklMNopQRSTuvw', description: 'Gateway transaction ID', required: false })
  gatewayTransactionId?: string;

  @ApiProperty({ example: 'ORD-2024-001', description: 'Order ID' })
  orderId: string;

  @ApiProperty({ example: 1, description: 'Customer ID' })
  customerId: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Processed at', required: false })
  processedAt?: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Refunded at', required: false })
  refundedAt?: Date;

  @ApiProperty({ example: 'Client secret for Stripe', description: 'Client secret for payment processing', required: false })
  clientSecret?: string;

  @ApiProperty({ example: true, description: 'Whether payment is refundable' })
  isRefundable: boolean;
}