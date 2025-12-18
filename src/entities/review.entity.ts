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
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('reviews')
@Index(['productId', 'customerId'])
@Index(['productId', 'status'])
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  productId: number;

  @Column('bigint')
  customerId: number;

  @Column('decimal', { precision: 2, scale: 1, default: 5 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ length: 50, default: 'pending' })
  status: string;

  @Column({ default: 0 })
  helpful: number;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'text', nullable: true })
  images: string;

  @Column({ nullable: true })
  orderDetailId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, product => product.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => User, user => user.reviews)
  @JoinColumn({ name: 'customerId' })
  customer: User;
}
