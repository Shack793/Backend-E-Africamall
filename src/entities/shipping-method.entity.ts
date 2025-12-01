import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shipping_methods')
export class ShippingMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @Column({ nullable: true })
  estimatedDelivery: string;

  @Column({ default: true })
  isActive: boolean;
}
