import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { BusinessSetting } from '../../entities/business-setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, BusinessSetting]),
  ],
  controllers: [PublicController],
  providers: [PublicService],
  exports: [PublicService],
})
export class SharedModule {}
