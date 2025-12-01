import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../../entities/vendor.entity';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { User } from '../../entities/user.entity';
import { OrderDetail } from '../../entities/order-detail.entity';
import { Order } from '../../entities/order.entity';


import { VendorsService } from './vendor.service';
import { UploadService } from '../upload/upload.service';


import { VendorController } from './vendor.controller';
import { UploadController } from '../upload/upload.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vendor,
      Product,
      Category,
      User,
      OrderDetail,
      Order
    ])
  ],
  controllers: [
    VendorController,
    UploadController
  ],
  providers: [
    VendorsService,
    UploadService
  ],
  exports: [
    VendorsService,
    UploadService,
    TypeOrmModule
  ]
})
export class VendorModule {}