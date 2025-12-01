import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderResponseDto } from './dto';
import JwtAuthGuard from '../../common/guards/jwt-auth.guard';
import RolesGuard from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found or insufficient stock' })
  async create(
    @Request() req,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    const customerId = req.user.customerId;
    return this.ordersService.create(createOrderDto, customerId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders - Admin only' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: [OrderResponseDto] })
  async findAll(): Promise<OrderResponseDto[]> {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get customer orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: [OrderResponseDto] })
  async findMyOrders(@Request() req): Promise<OrderResponseDto[]> {
    const customerId = req.user.customerId;
    return this.ordersService.findByCustomer(customerId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order statistics - Admin only' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string, @Request() req): Promise<OrderResponseDto> {
    const order = await this.ordersService.findOne(id);
    
    const isAdmin = req.user.role === 'admin';
    const isOwner = order.customerId === req.user.customerId;
    
    if (!isAdmin && !isOwner) {
      throw new Error('Access denied');
    }

    return order;
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status - Admin only' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully', type: OrderResponseDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', type: String, description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Order cannot be cancelled' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async cancelOrder(@Param('id') id: string, @Request() req): Promise<OrderResponseDto> {
    const customerId = req.user.role === 'admin' ? undefined : req.user.customerId;
    return this.ordersService.cancelOrder(id, customerId);
  }
}