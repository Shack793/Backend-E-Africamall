import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  BeforeInsert
} from 'typeorm';

import { Customer } from './customer.entity';
import { Vendor } from './vendor.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'vendor', 'customer'],
    default: 'customer',
  })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  customerId: number;

  @Column({ nullable: true })
  vendorId: number;

  @OneToOne(() => Customer, (customer) => customer.user)
  customer: Customer;

  @OneToOne(() => Vendor, (vendor) => vendor.user)
  vendor: Vendor;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
