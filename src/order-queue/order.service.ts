import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Customer } from '../entities/customer.entity';
import { OrderDetail } from '../entities/order-detail.entity';
import { CreateOrderDto, OrderItemDto } from '../modules/orders/dto/create-order.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailRepo: Repository<OrderDetail>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectQueue('order')
    private readonly orderQueue: Queue,
  ) {}

  async createOrder(dto: CreateOrderDto, customerId: string): Promise<Order> { // Changed to string
    // Remove .toString() since customerId is now string
    const customer = await this.customerRepo.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const order = this.orderRepo.create({
      customer,
      shippingAddress: dto.shippingAddress,
      billingAddress: dto.billingAddress,
      paymentMethod: dto.paymentMethod,
      customerNotes: dto.customerNotes,
    });
    const savedOrder = await this.orderRepo.save(order);

    for (const item of dto.items) {
      const product = await this.productRepo.findOne({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Product with ID ${item.productId} not found`);

      const orderDetail = this.orderDetailRepo.create({
        order: savedOrder,
        product,
        quantity: item.quantity,
        unitPrice: item.unitPrice ?? product.price,
      });

      await this.orderDetailRepo.save(orderDetail);
    }

    await this.orderQueue.add('sendEmail', {
      orderId: savedOrder.id,
      email: customer.email,
    });

    const fullOrder = await this.orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ['orderDetails', 'orderDetails.product', 'customer'],
    });
    if (!fullOrder) {
      throw new NotFoundException(`Order with ID ${savedOrder.id} not found after creation`);
    }
    return fullOrder;
  }

  // Update other methods that use customerId to use string
  async getCustomerOrders(customerId: string): Promise<Order[]> { // Add this method if needed
    const customer = await this.customerRepo.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    return await this.orderRepo.find({
      where: { customer: { id: customerId } },
      relations: ['orderDetails', 'orderDetails.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOrderById(orderId: string, customerId: string): Promise<Order> { // Changed orderId to string
    const order = await this.orderRepo.findOne({
      where: { 
        id: orderId,
        customer: { id: customerId }
      },
      relations: ['orderDetails', 'orderDetails.product', 'customer'],
    });
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    return order;
  }
}