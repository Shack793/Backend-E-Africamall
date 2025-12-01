// customer.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn,
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';

import { Payment } from './payment.entity';
import { Order } from './order.entity';
import { User } from './user.entity';
import { Address } from './address.entity';
import { Cart } from './cart.entity';

@Entity('customers')
export class Customer {

  // FIXED: Must match MySQL (INT AUTO_INCREMENT)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @OneToMany(() => Payment, payment => payment.customer)
  payments: Payment[];

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];

  @OneToMany(() => Address, address => address.customer)
  addresses: Address[];

  @OneToOne(() => Cart, cart => cart.customer)
  cart: Cart;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @Column({ nullable: true, unique: true })
  userId: string;

  @OneToOne(() => User, user => user.customer)
  @JoinColumn({ name: 'userId' })
  user: User;
}
