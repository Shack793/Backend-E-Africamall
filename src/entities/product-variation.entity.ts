import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variations')
export class ProductVariation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @ManyToOne(() => Product, (product) => product.variations, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  product: Product;
    createdAt: any;
    updatedAt: any;
}
