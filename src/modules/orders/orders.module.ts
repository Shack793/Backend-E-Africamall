import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../../entities/order.entity';
import { OrderDetail } from '../../entities/order-detail.entity';
import { Product } from '../../entities/product.entity';
import { Customer } from '../../entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Product, Customer]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}