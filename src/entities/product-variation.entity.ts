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

@Entity('product_variations')
@Index(['productId'])
@Index(['productId', 'color'])
export class ProductVariation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  productId: number;

  @Column({ length: 100, nullable: true })
  color: string;

  @Column({ length: 100, nullable: true })
  size: string;

  @Column({ type: 'text', nullable: true })
  sku: string;

  @Column('decimal', { precision: 15, scale: 2 })
  price: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  cost: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ length: 50, default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, product => product.variations, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
