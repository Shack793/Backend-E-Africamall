import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { Vendor } from '../../entities/vendor.entity';
import { ProductVariation } from '../../entities/product-variation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      Vendor,
      ProductVariation,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}