import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { User } from '../entities/user.entity';
import { Vendor } from '../entities/vendor.entity';
import { Customer } from '../entities/customer.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ProductVariation } from '../entities/product-variation.entity';
import { Order } from '../entities/order.entity';
import { OrderDetail } from '../entities/order-detail.entity';
import { Transaction } from '../entities/transaction.entity';
import { BusinessSetting } from '../entities/business-setting.entity';
import { ShippingMethod } from '../entities/shipping-method.entity';
import { Coupon } from '../entities/coupon.entity';
import { Review } from '../entities/review.entity';
import { SupportTicket } from '../entities/support-ticket.entity';
import { Cart } from '../entities/cart.entity';
import { Address } from '../entities/address.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  entities: [
    User,
    Vendor,
    Customer,
    Category,
    Product,
    ProductVariation,
    Order,
    OrderDetail,
    Transaction,
    BusinessSetting,
    ShippingMethod,
    Coupon,
    Review,
    SupportTicket,
    Cart,
    Address,
  ],
  migrations: ['src/migrations/*.ts'], 
  synchronize: false,
});