import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Vendor } from '../entities/vendor.entity';
import { Customer } from '../entities/customer.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Order } from '../entities/order.entity';
import { Cart } from '../entities/cart.entity';
import { Address } from '../entities/address.entity';

export const mysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  entities: [
    User,
    Vendor,
    Customer,
    Product,
    Category,
    Order,
    Cart,
    Address,
  ],
  synchronize: false,
  logging: true,
  timezone: '+00:00',
};
