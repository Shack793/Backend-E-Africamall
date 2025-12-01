import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { OrderDetail } from './order-detail.entity';
import { Category } from './category.entity';
import { Vendor } from './vendor.entity';
import { ProductVariation } from './product-variation.entity';
import { Review } from './review.entity';

@Entity('products') // FIX: Add the table name 'products'
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column('int')
  stock: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  categoryId: number;

  @Column({ nullable: true })
  vendorId: string;

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.product)
  orderDetails: OrderDetail[];

  // Add proper category relation
  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  // Add proper vendor relation
  @ManyToOne(() => Vendor, vendor => vendor.products)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  // Add proper variations relation
  @OneToMany(() => ProductVariation, variation => variation.product)
  variations: ProductVariation[];

  // Add proper reviews relation
  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}