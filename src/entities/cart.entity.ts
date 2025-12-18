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
import { Product } from './product.entity';

@Entity('carts')
@Index(['customerId', 'productId'])
@Index(['customerId'])
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  customerId: number;

  @Column('bigint')
  productId: number;

  @Column('int', { default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  variation: string;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  price: number;

  @Column({ default: false })
  isGuest: boolean;

  @Column({ default: true })
  isChecked: boolean;

  @Column({ type: 'text', nullable: true })
  productMetaData: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.carts)
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ManyToOne(() => Product, product => product.carts)
  @JoinColumn({ name: 'productId' })
  product: Product;
}