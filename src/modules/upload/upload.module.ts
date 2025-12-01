import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from '../../entities/vendor.entity';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity'; 
import { VendorsService } from '../vendor/vendor.service'; 
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vendor, 
      Product, 
      Category 
    ])
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    VendorsService
  ],
  exports: [UploadService]
})
export class UploadModule {}