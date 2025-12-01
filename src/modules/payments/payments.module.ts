import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Payment } from '../../entities/payment.entity';
import { Order } from '../../entities/order.entity';
import { Customer } from '../../entities/customer.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { StripeService } from './gateways/stripe.service';
import { PaypalService } from './gateways/paypal.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Payment,
      Order,
      Customer
    ])
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    StripeService, 
    PaypalService  
  ],
  exports: [
    PaymentsService,
    StripeService,
    PaypalService
  ]
})
export class PaymentsModule {}