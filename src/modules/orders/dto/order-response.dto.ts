import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../../entities/order.entity';

class OrderItemResponseDto {
  @ApiProperty({ example: 1, description: 'Order item ID' })
  id: number;

  @ApiProperty({ example: 'Product Name', description: 'Product name' })
  productName: string;

  @ApiProperty({ example: 'product.jpg', description: 'Product image', required: false })
  productImage?: string;

  @ApiProperty({ example: 2, description: 'Quantity' })
  quantity: number;

  @ApiProperty({ example: 99.99, description: 'Unit price' })
  unitPrice: number;

  @ApiProperty({ example: 199.98, description: 'Total price' })
  totalPrice: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Order ID' })
  id: string;

  @ApiProperty({ example: 'ORD-2024-001', description: 'Order number' })
  orderNumber: string;

  @ApiProperty({ example: 199.98, description: 'Total amount' })
  totalAmount: number;

  @ApiProperty({ example: 19.99, description: 'Tax amount' })
  taxAmount: number;

  @ApiProperty({ example: 9.99, description: 'Shipping cost' })
  shippingCost: number;

  @ApiProperty({ example: 10.00, description: 'Discount amount' })
  discountAmount: number;

  @ApiProperty({ example: 'pending', description: 'Order status', enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ example: 'paid', description: 'Payment status' })
  paymentStatus: string;

  @ApiProperty({ example: 'Credit Card', description: 'Payment method' })
  paymentMethod: string;

  @ApiProperty({ example: '123 Main St, City, Country', description: 'Shipping address' })
  shippingAddress: string;

  @ApiProperty({ example: '123 Main St, City, Country', description: 'Billing address', required: false })
  billingAddress?: string;

  @ApiProperty({ example: 'Please deliver after 5 PM', description: 'Customer notes', required: false })
  customerNotes?: string;

  @ApiProperty({ example: 'Handled by admin', description: 'Admin notes', required: false })
  adminNotes?: string;

  @ApiProperty({ example: 1, description: 'Customer ID' })
  customerId: number;

  @ApiProperty({ type: [OrderItemResponseDto], description: 'Order items' })
  items: OrderItemResponseDto[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: '2024-01-02T00:00:00.000Z', description: 'Shipped at', required: false })
  shippedAt?: Date;

  @ApiProperty({ example: '2024-01-03T00:00:00.000Z', description: 'Delivered at', required: false })
  deliveredAt?: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Cancelled at', required: false })
  cancelledAt?: Date;
}