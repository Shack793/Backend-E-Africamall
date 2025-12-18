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
import { OrderDetail } from './order-detail.entity';
import { Category } from './category.entity';
import { User } from './user.entity';
import { ProductVariation } from './product-variation.entity';
import { Review } from './review.entity';
import { Cart } from './cart.entity';

@Entity('products')
@Index(['categoryId', 'status'])
@Index(['userId', 'addedBy'])
@Index(['slug'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint')
  userId: number;

  @Column({ length: 50, default: 'seller' })
  addedBy: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  code: string;

  @Column({ length: 255 })
  slug: string;

  @Column('bigint')
  categoryId: number;

  @Column('bigint', { nullable: true })
  subCategoryId: number;

  @Column('bigint', { nullable: true })
  subSubCategoryId: number;

  @Column('bigint', { nullable: true })
  brandId: number;

  @Column({ length: 100, nullable: true })
  unit: string;

  @Column({ length: 50, nullable: true })
  digitalProductType: string;

  @Column({ length: 50, default: 'physical' })
  productType: string;

  @Column('text')
  details: string;

  @Column('json', { nullable: true })
  colors: any;

  @Column('json', { nullable: true })
  choiceOptions: any;

  @Column('json', { nullable: true })
  variation: any;

  @Column('int', { default: 1 })
  minQty: number;

  @Column('int', { default: 1 })
  published: number;

  @Column('decimal', { precision: 15, scale: 2 })
  tax: number;

  @Column({ length: 50, default: 'amount' })
  taxType: string;

  @Column({ length: 50, default: 'exclude' })
  taxModel: string;

  @Column('decimal', { precision: 15, scale: 2 })
  unitPrice: number;

  @Column('int', { default: 1 })
  status: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  discount: number;

  @Column({ length: 50, default: 'amount' })
  discountType: string;

  @Column('int', { default: 0 })
  currentStock: number;

  @Column('int', { default: 1 })
  minimumOrderQty: number;

  @Column('int', { default: 0 })
  freeShipping: number;

  @Column('int', { default: 0 })
  requestStatus: number;

  @Column('int', { default: 0 })
  featuredStatus: number;

  @Column('int', { default: 0 })
  refundable: number;

  @Column('int', { default: 0 })
  featured: number;

  @Column('int', { default: 0 })
  flashDeal: number;

  @Column('bigint')
  sellerId: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  purchasePrice: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  shippingCost: number;

  @Column('int', { default: 0 })
  multiplyQty: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  tempShippingCost: number;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ length: 50, nullable: true })
  thumbnailStorageType: string;

  @Column({ nullable: true })
  previewFile: string;

  @Column({ length: 50, nullable: true })
  previewFileStorageType: string;

  @Column({ length: 50, default: 'no' })
  digitalFileReady: string;

  @Column({ nullable: true })
  metaTitle: string;

  @Column('text', { nullable: true })
  metaDescription: string;

  @Column({ nullable: true })
  metaImage: string;

  @Column('int', { default: 0 })
  isShippingCostUpdated: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => User, user => user.productsAsVendor)
  @JoinColumn({ name: 'userId' })
  vendor: User;

  @OneToMany(() => OrderDetail, detail => detail.product)
  orderDetails: OrderDetail[];

  @OneToMany(() => ProductVariation, variation => variation.product)
  variations: ProductVariation[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @OneToMany(() => Cart, cart => cart.product)
  carts: Cart[];
}