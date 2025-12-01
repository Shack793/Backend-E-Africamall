import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import JwtAuthGuard from '../../common/guards/jwt-auth.guard';
import RolesGuard from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiResponse({ status: 201, description: 'Payment intent created successfully', type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async createPaymentIntent(
    @Request() req,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const customerId = req.user.customerId;
    return this.paymentsService.createPaymentIntent(createPaymentDto, customerId);
  }

  @Post('process')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process payment' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully', type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'Payment processing failed' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async processPayment(
    @Request() req,
    @Body() processPaymentDto: ProcessPaymentDto,
  ): Promise<PaymentResponseDto> {
    const customerId = req.user.customerId;
    return this.paymentsService.processPayment(processPaymentDto, customerId);
  }

  @Put(':id/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refund a payment' })
  @ApiParam({ name: 'id', type: String, description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully', type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'Refund failed' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async refundPayment(
    @Request() req,
    @Param('id') id: string,
    @Body() refundPaymentDto: RefundPaymentDto,
  ): Promise<PaymentResponseDto> {
    const customerId = req.user.role === 'admin' ? undefined : req.user.customerId;
    const { payment } = await this.paymentsService.refundPayment(id, refundPaymentDto, customerId);
    return {
      id: payment.id,
      orderId: payment.orderId,
      customerId: payment.customerId,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      method: payment.method,
      paymentGateway: payment.paymentGateway,
      isRefundable: payment.isRefundable,
    };
  }

  @Get('my-payments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get customer payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully', type: [PaymentResponseDto] })
  async getMyPayments(@Request() req): Promise<PaymentResponseDto[]> {
    const customerId = req.user.customerId;
    return this.paymentsService.getCustomerPayments(customerId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments - Admin only' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully', type: [PaymentResponseDto] })
  async getAllPayments(): Promise<PaymentResponseDto[]> {
    return this.paymentsService.getAllPayments();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment statistics - Admin only' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.paymentsService.getPaymentStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully', type: PaymentResponseDto })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPayment(@Param('id') id: string, @Request() req): Promise<PaymentResponseDto> {
    const customerId = req.user.role === 'admin' ? undefined : req.user.customerId;
    const payment = await this.paymentsService.getPayment(id, customerId);
    return {
      id: payment.id,
      orderId: payment.orderId,
      customerId: payment.customerId,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      method: payment.method,
      paymentGateway: payment.paymentGateway,
      isRefundable: payment.isRefundable,
    };
  }
}