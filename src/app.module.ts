import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { getDatabaseConfig } from './config/database.config';
import { HealthModule } from './modules/health/health.module';
import { AppController } from './app.controller'; 

import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AdminModule } from './modules/admin/admin.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { CustomerModule } from './modules/customer/customer.module';
import { UploadModule } from './modules/upload/upload.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    

    HealthModule,
    AuthModule,
    SharedModule,
    

    ProductsModule,
    CategoriesModule,
    OrdersModule,
    PaymentsModule,
    

    AdminModule,
    VendorModule,
    CustomerModule,
    

    UploadModule,
  ],
  controllers: [AppController],
})
export class AppModule {}