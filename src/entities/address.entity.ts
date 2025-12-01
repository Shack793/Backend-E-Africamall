import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.addresses)
  customer: Customer;

  @Column()
  addressLine: string;

  @Column({ nullable: true })
  addressLine2: string; // For apartment/suite numbers

  @Column()
  city: string;

  @Column()
  region: string; // State/Province/Region

  @Column()
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ default: false })
  isDefault: boolean; // Mark as default shipping address

  @Column({ default: false })
  isBilling: boolean; // Mark as billing address

  @Column({ nullable: true })
  label: string; // "Home", "Work", "Office", etc.

  @Column({ nullable: true })
  phone: string; // Phone number for this address

  @Column({ nullable: true })
  instructions: string; // Delivery instructions

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}