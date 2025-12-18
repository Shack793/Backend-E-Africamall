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
import { User } from './user.entity';

@Entity('shipping_addresses')
@Index(['customerId'])
@Index(['customerId', 'isBilling'])
export class ShippingAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  customerId: number;

  @Column({ length: 100, nullable: true })
  label: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 255, nullable: true })
  address2: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100 })
  country: string;

  @Column({ length: 20, nullable: true })
  zip: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  longitude: number;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: false })
  isBilling: boolean;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.shippingAddresses)
  @JoinColumn({ name: 'customerId' })
  customer: User;
}

// Export as Address for backward compatibility
export { ShippingAddress as Address };
