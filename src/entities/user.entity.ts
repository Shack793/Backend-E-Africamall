import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

import { Order } from './order.entity';
import { Product } from './product.entity';
import { Cart } from './cart.entity';
import { Review } from './review.entity';
import { ShippingAddress } from './shipping-address.entity';

@Entity('users')
@Index(['email'])
@Index(['phone'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 255, nullable: true })
  fName: string;

  @Column({ length: 255, nullable: true })
  lName: string;

  @Column({ length: 255, unique: true, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  phone: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ length: 255, nullable: true })
  streetAddress: string;

  @Column({ length: 255, nullable: true })
  country: string;

  @Column({ length: 255, nullable: true })
  city: string;

  @Column({ length: 255, nullable: true })
  zip: string;

  @Column({ length: 255, nullable: true })
  houseNo: string;

  @Column({ length: 255, nullable: true })
  apartmentNo: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 255, nullable: true })
  paymentCardLastFour: string;

  @Column({ length: 255, nullable: true })
  paymentCardBrand: string;

  @Column({ length: 255, nullable: true })
  paymentCardFawryToken: string;

  @Column({ length: 50, nullable: true })
  loginMedium: string;

  @Column({ length: 255, nullable: true })
  socialId: string;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ length: 255, nullable: true })
  temporaryToken: string;

  @Column({ length: 255, nullable: true })
  rememberToken: string;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  walletBalance: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  loyaltyPoint: number;

  @Column('tinyint', { default: 0 })
  loginHitCount: number;

  @Column({ default: false })
  isTempBlocked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  tempBlockTime: Date;

  @Column({ length: 255, nullable: true })
  referralCode: string;

  @Column('bigint', { nullable: true })
  referredBy: number;

  @Column({ length: 255, nullable: true })
  cmFirebaseToken: string;

  @Column({ length: 10, default: 'en' })
  appLanguage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @Column({ length: 50, default: 'customer' })
  role: string; // 'customer', 'vendor', 'admin'

  @Column('bigint', { nullable: true })
  customerId: number;

  @Column('bigint', { nullable: true })
  vendorId: number;

  // Relations
  @OneToMany(() => Product, product => product.vendor)
  productsAsVendor: Product[];

  @OneToMany(() => Order, order => order.customer)
  ordersAsCustomer: Order[];

  @OneToMany(() => Order, order => order.deliveryMan)
  ordersAsDeliveryMan: Order[];

  @OneToMany(() => Cart, cart => cart.customer)
  carts: Cart[];

  @OneToMany(() => Review, review => review.customer)
  reviews: Review[];

  @OneToMany(() => ShippingAddress, address => address.customer)
  shippingAddresses: ShippingAddress[];
}
