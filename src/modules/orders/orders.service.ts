import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderDetail } from '../../entities/order-detail.entity';
import { Product } from '../../entities/product.entity';
import { Customer } from '../../entities/customer.entity';
import { CreateOrderDto, UpdateOrderStatusDto, OrderResponseDto } from './dto';
import { PaymentStatus } from 'src/entities/payment.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepo: Repository<OrderDetail>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly dataSource: DataSource,
  ) {}

  private generateOrderNumber(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  private toOrderResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: parseFloat(order.totalAmount.toString()),
      taxAmount: parseFloat(order.taxAmount.toString()),
      shippingCost: parseFloat(order.shippingCost.toString()),
      discountAmount: parseFloat(order.discountAmount.toString()),
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      customerNotes: order.customerNotes,
      adminNotes: order.adminNotes,
      customerId: order.customerId,
      items: order.orderDetails?.map(detail => ({
        id: detail.id,
        productName: detail.productName,
        productImage: detail.productImage,
        quantity: detail.quantity,
        unitPrice: parseFloat(detail.unitPrice.toString()),
        totalPrice: parseFloat(detail.totalPrice.toString()),
        productId: detail.productId,
      })) || [],
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
    };
  }

  async create(createOrderDto: CreateOrderDto, customerId: string): Promise<OrderResponseDto> { 
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customer = await this.customerRepo.findOne({ where: { id: Number(customerId) } }); 
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      let totalAmount = 0;
      const orderDetails: Partial<OrderDetail>[] = [];

      for (const item of createOrderDto.items) {
        const product = await this.productRepo.findOne({ 
          where: { id: item.productId },
          relations: ['vendor']
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
        }

        const unitPrice = item.unitPrice || parseFloat(product.price.toString());
        const totalPrice = unitPrice * item.quantity;

        product.stock -= item.quantity;
        await queryRunner.manager.save(Product, product);

        orderDetails.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
          productName: product.name,
          productImage: product.image,
        });

        totalAmount += totalPrice;
      }

      const taxAmount = totalAmount * 0.1; 
      const shippingCost = 9.99; 
      const discountAmount = createOrderDto.couponCode ? totalAmount * 0.1 : 0; 

      const finalTotal = totalAmount + taxAmount + shippingCost - discountAmount;

      const order = this.orderRepo.create({
        orderNumber: this.generateOrderNumber(),
        totalAmount: finalTotal,
        taxAmount,
        shippingCost,
        discountAmount,
        paymentMethod: createOrderDto.paymentMethod,
        shippingAddress: createOrderDto.shippingAddress,
        billingAddress: createOrderDto.billingAddress || createOrderDto.shippingAddress,
        customerNotes: createOrderDto.customerNotes,
        customerId: Number(customerId), 
        orderDetails: orderDetails as OrderDetail[],
      });

      const savedOrder = await queryRunner.manager.save(Order, order);
      await queryRunner.commitTransaction();

      const completeOrder = await this.orderRepo.findOne({
        where: { id: savedOrder.id ?? savedOrder[0]?.id },
        relations: ['orderDetails', 'customer'],
      });

      if (!completeOrder) {
        throw new NotFoundException(`Order with ID ${savedOrder.id} not found after creation`);
      }

      return this.toOrderResponseDto(completeOrder);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      relations: ['orderDetails', 'customer'],
      order: { createdAt: 'DESC' },
    });
    return orders.map(order => this.toOrderResponseDto(order));
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['orderDetails', 'customer'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.toOrderResponseDto(order);
  }

  async findByCustomer(customerId: string): Promise<OrderResponseDto[]> { 
    const orders = await this.orderRepo.find({
      where: { customerId: Number(customerId) }, 
      relations: ['orderDetails'],
      order: { createdAt: 'DESC' },
    });
    return orders.map(order => this.toOrderResponseDto(order));
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (updateOrderStatusDto.status) {
      order.status = updateOrderStatusDto.status;

      if (updateOrderStatusDto.status === OrderStatus.SHIPPED && !order.shippedAt) {
        order.shippedAt = new Date();
      } else if (updateOrderStatusDto.status === OrderStatus.DELIVERED && !order.deliveredAt) {
        order.deliveredAt = new Date();
      } else if (updateOrderStatusDto.status === OrderStatus.CANCELLED && !order.cancelledAt) {
        order.cancelledAt = new Date();
      }
    }

    if (updateOrderStatusDto.paymentStatus) {
      order.paymentStatus = updateOrderStatusDto.paymentStatus;
    }

    if (updateOrderStatusDto.adminNotes) {
      order.adminNotes = updateOrderStatusDto.adminNotes;
    }

    const updatedOrder = await this.orderRepo.save(order);
    const completeOrder = await this.orderRepo.findOne({
      where: { id: updatedOrder.id },
      relations: ['orderDetails', 'customer'],
    });

    if (!completeOrder) {
      throw new NotFoundException(`Order with ID ${updatedOrder.id} not found after update`);
    }

    return this.toOrderResponseDto(completeOrder);
  }
    
  async cancelOrder(id: string, customerId?: string): Promise<OrderResponseDto> { 
    const order = await this.orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (customerId && String(order.customerId) !== customerId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }

    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();

    const orderDetails = await this.orderDetailRepo.find({ where: { orderId: id } });
    
    for (const detail of orderDetails) {
      const product = await this.productRepo.findOne({ where: { id: detail.productId } });
      if (product) {
        product.stock += detail.quantity;
        await this.productRepo.save(product);
      }
    }

    const updatedOrder = await this.orderRepo.save(order);
    const completeOrder = await this.orderRepo.findOne({
      where: { id: updatedOrder.id },
      relations: ['orderDetails', 'customer'],
    });

    if (!completeOrder) {
      throw new NotFoundException(`Order with ID ${updatedOrder.id} not found after update`);
    }
    return this.toOrderResponseDto(completeOrder);
  }

  async getOrderStats() {
    const totalOrders = await this.orderRepo.count();
    const totalRevenue = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.paymentStatus = :status', { status: PaymentStatus.PAID })
      .getRawOne();

    const statusCounts = await this.orderRepo
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    const recentOrders = await this.orderRepo.find({
      relations: ['customer', 'orderDetails'],
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.total) || 0,
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {}),
      recentOrders: recentOrders.map(order => this.toOrderResponseDto(order)),
    };
  }
}