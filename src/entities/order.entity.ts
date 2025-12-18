import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { Payment } from './payment.entity';
import { OrderDetail } from './order-detail.entity';
import { User } from './user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  CANCELLED = 'cancelled'
}

@Entity('orders')
@Index(['customerId', 'createdAt'])
@Index(['orderStatus'])
@Index(['paymentStatus'])
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  customerId: number;

  @Column({ default: false })
  isGuest: boolean;

  @Column({ length: 50, default: 'user' })
  customerType: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  orderStatus: OrderStatus;

  @Column({ length: 100, default: 'cod' })
  paymentMethod: string;

  @Column({ length: 255, nullable: true })
  transactionRef: string;

  @Column({ length: 100, nullable: true })
  paymentBy: string;

  @Column({ type: 'text', nullable: true })
  paymentNote: string;

  @Column('decimal', { precision: 15, scale: 2 })
  orderAmount: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  paidAmount: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  bringChangeAmount: number;

  @Column({ length: 10, nullable: true })
  bringChangeAmountCurrency: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  adminCommission: number;

  @Column({ default: false })
  isPause: boolean;

  @Column({ type: 'text', nullable: true })
  cause: string;

  @Column('text')
  shippingAddress: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ length: 50, default: 'amount' })
  discountType: string;

  @Column({ length: 255, nullable: true })
  couponCode: string;

  @Column({ length: 50, default: 'inhouse' })
  couponDiscountBearer: string;

  @Column({ length: 50, default: 'seller' })
  shippingResponsibility: string;

  @Column('bigint', { nullable: true })
  shippingMethodId: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  shippingCost: number;

  @Column({ default: false })
  isShippingFree: boolean;

  @Column({ length: 255, nullable: true })
  orderGroupId: string;

  @Column({ length: 255, nullable: true })
  verificationCode: string;

  @Column({ default: false })
  verificationStatus: boolean;

  @Column('bigint', { nullable: true })
  sellerId: number;

  @Column({ length: 50, nullable: true })
  sellerIs: string;

  @Column('text', { nullable: true })
  shippingAddressData: string;

  @Column('text', { nullable: true })
  billingAddressData: string;

  @Column('bigint', { nullable: true })
  deliveryManId: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  deliverymanCharge: number;

  @Column({ type: 'datetime', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ type: 'text', nullable: true })
  orderNote: string;

  @Column('bigint', { nullable: true })
  billingAddress: number;

  @Column({ type: 'text', nullable: true })
  orderType: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  extraDiscount: number;

  @Column({ length: 50, default: 'amount' })
  extraDiscountType: string;

  @Column({ length: 50, default: 'admin' })
  freeDeliveryBearer: string;

  @Column({ default: false })
  checked: boolean;

  @Column({ length: 50, nullable: true })
  shippingType: string;

  @Column({ length: 50, nullable: true })
  deliveryType: string;

  @Column({ length: 255, nullable: true })
  deliveryServiceName: string;

  @Column({ length: 255, nullable: true })
  thirdPartyDeliveryTrackingId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.ordersAsCustomer)
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @OneToMany(() => OrderDetail, detail => detail.order, { eager: true })
  orderDetails: OrderDetail[];

  @ManyToOne(() => User, user => user.ordersAsDeliveryMan, { nullable: true })
  @JoinColumn({ name: 'deliveryManId' })
  deliveryMan: User;

  @OneToMany(() => Payment, payment => payment.order)
  payments: Payment[];
}