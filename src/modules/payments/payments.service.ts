import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from '../../entities/payment.entity';
import { Order, OrderStatus } from '../../entities/order.entity';
import { Customer } from '../../entities/customer.entity';
import { StripeService } from './gateways/stripe.service';
import { PaypalService } from './gateways/paypal.service';
import { CreatePaymentDto, ProcessPaymentDto, RefundPaymentDto } from './dto';

@Injectable()
export class PaymentsService {
  getAllPayments: any;
  getPaymentStats() {
      throw new Error('Method not implemented.');
  }
  processPayment(processPaymentDto: ProcessPaymentDto, customerId: any): import("./dto").PaymentResponseDto | PromiseLike<import("./dto").PaymentResponseDto> {
      throw new Error('Method not implemented.');
  }
  createPaymentIntent(createPaymentDto: CreatePaymentDto, customerId: any): import("./dto").PaymentResponseDto | PromiseLike<import("./dto").PaymentResponseDto> {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly stripeService: StripeService,
    private readonly paypalService: PaypalService,
  ) {}

  async createStripePayment(orderId: string, customerId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const customer = await this.customerRepo.findOne({ where: { id: Number(customerId) } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const paymentIntent = await this.stripeService.createPaymentIntent(
      order.totalAmount,
      'usd',
      {
        orderId: order.id,
        customerId: customer.id.toString(),
      }
    );

    const payment = this.paymentRepo.create({
      order: order,
      customer: customer,
      amount: order.totalAmount,
      currency: 'GHS',
      paymentMethod: PaymentMethod.STRIPE,
      paymentIntentId: paymentIntent.paymentIntentId,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRepo.save(payment);

    return {
      paymentId: savedPayment.id,
      clientSecret: paymentIntent.clientSecret,
      amount: savedPayment.amount,
      currency: savedPayment.currency,
    };
  }

  async createPaypalPayment(orderId: string, customerId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const customer = await this.customerRepo.findOne({ where: { id: Number(customerId) } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const paypalOrder = await this.paypalService.createOrder(order.totalAmount);

    const payment = this.paymentRepo.create({
      order: order,
      customer: customer,
      amount: order.totalAmount,
      currency: 'GHS',
      paymentMethod: PaymentMethod.PAYPAL,
      paymentIntentId: paypalOrder.id,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRepo.save(payment);

    return {
      paymentId: savedPayment.id,
      paypalOrderId: paypalOrder.id,
      approvalUrl: paypalOrder.links?.find(link => link.rel === 'approve')?.href,
      amount: savedPayment.amount,
      currency: savedPayment.currency,
    };
  }

  async confirmStripePayment(paymentId: string, paymentIntentId: string) {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const result = await this.stripeService.confirmPayment(paymentIntentId);

    if (result.success) {
      payment.status = PaymentStatus.COMPLETED;
      payment.processedAt = new Date();
      await this.paymentRepo.save(payment);

      const order = await this.orderRepo.findOne({ where: { id: payment.orderId } });
      if (order) {
        order.status = OrderStatus.PAID;
        await this.orderRepo.save(order);
      }
    }

    return {
      success: result.success,
      payment,
    };
  }

  async confirmPaypalPayment(paymentId: string, orderId: string) {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const result = await this.paypalService.captureOrder(orderId);

    if (result.status === 'COMPLETED') {
      payment.status = PaymentStatus.COMPLETED;
      payment.processedAt = new Date();
      await this.paymentRepo.save(payment);

      const order = await this.orderRepo.findOne({ where: { id: payment.orderId } });
      if (order) {
        order.status = OrderStatus.PAID;
        await this.orderRepo.save(order);
      }
    }

    return {
      success: result.status === 'COMPLETED',
      payment,
      paypalResponse: result,
    };
  }

  async getPayment(paymentId: string, customerId: any) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['order', 'customer'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getCustomerPayments(customerId: string) {
    return await this.paymentRepo.find({
      where: { customerId: Number(customerId) },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }

  async refundPayment(paymentId: string, refundPaymentDto: RefundPaymentDto, amount?: number) {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    let refund;
    if (payment.paymentMethod === PaymentMethod.STRIPE && payment.paymentIntentId) {
      refund = await this.stripeService.createRefund(payment.paymentIntentId, amount);
    } else {
      throw new BadRequestException('Refund not supported for this payment method');
    }

    if (refund) {
      payment.status = PaymentStatus.REFUNDED;
      payment.refundedAt = new Date();
      await this.paymentRepo.save(payment);

      const order = await this.orderRepo.findOne({ where: { id: payment.orderId } });
      if (order) {
        order.status = OrderStatus.REFUNDED;
        await this.orderRepo.save(order);
      }
    }

    return {
      refund,
      payment,
    };
  }
}