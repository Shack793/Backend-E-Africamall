import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { Order } from './order.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
  PAID = 'paid'
}

export enum PaymentMethod {
  COD = 'cod',
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  MOBILE_PAYMENT = 'mobile_payment',
  SSLCOMMERZ = 'sslcommerz',
  RAZOR = 'razor'
}

@Entity('payments')
@Index(['orderId', 'status'])
@Index(['orderId'])
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  orderId: number;

  @Column('bigint', { nullable: true })
  customerId: number;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ length: 10, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.COD
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Column({ length: 255, nullable: true })
  transactionId: string;

  @Column({ length: 255, nullable: true })
  gatewayTransactionId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  metadata: string;

  @Column({ type: 'datetime', nullable: true })
  processedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  refundedAt: Date;

  @Column('decimal', { precision: 15, scale: 2, default: 0, nullable: true })
  refundAmount: number;

  @Column({ default: false })
  isRefundable: boolean;

  @Column({ length: 100, nullable: true })
  refundReason: string;

  @Column({ length: 50, default: 'inhouse' })
  paymentGateway: string;

  @Column({ default: 0 })
  retryCount: number;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Order, order => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;
}