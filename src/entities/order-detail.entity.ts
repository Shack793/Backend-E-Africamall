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
import { Product } from './product.entity';

@Entity('order_details')
@Index(['orderId', 'productId'])
@Index(['orderId'])
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  orderId: number;

  @Column('bigint')
  productId: number;

  @Column('bigint', { nullable: true })
  sellerId: number;

  @Column({ length: 100, nullable: true })
  productName: string;

  @Column({ type: 'text', nullable: true })
  variation: string;

  @Column('decimal', { precision: 15, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  discount: number;

  @Column({ length: 50, default: 'amount' })
  discountType: string;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('decimal', { precision: 15, scale: 2 })
  totalPrice: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  tax: number;

  @Column({ length: 50, default: 'amount' })
  taxType: string;

  @Column({ length: 50, default: 'inhouse' })
  taxModel: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  shippingCost: number;

  @Column({ default: false })
  isShippingFree: boolean;

  @Column({ type: 'text', nullable: true })
  productDetails: string;

  @Column({ default: 1 })
  refundable: boolean;

  @Column({ length: 50, default: 'pending' })
  deliveryStatus: string;

  @Column({ length: 50, nullable: true })
  paymentStatus: string;

  @Column({ type: 'text', nullable: true })
  vendorShippingAddress: string;

  @Column({ default: false })
  isShippingInformationUpdated: boolean;

  @Column({ type: 'datetime', nullable: true })
  estimatedDeliveryDate: Date;

  @Column({ type: 'datetime', nullable: true })
  actualDeliveryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Order, order => order.orderDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product, product => product.orderDetails)
  @JoinColumn({ name: 'productId' })
  product: Product;
}