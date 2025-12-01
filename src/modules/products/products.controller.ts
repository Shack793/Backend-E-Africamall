import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './dto';
import { ProductQueryDto } from './dto/product-query.dto';
import JwtAuthGuard from '../../common/guards/jwt-auth.guard';
import RolesGuard from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Product with this name already exists' })
  async create(
    @Request() req,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const vendorId = req.user.role === 'vendor' ? req.user.vendorId : undefined;
    return this.productsService.create(createProductDto, vendorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of featured products to return' })
  @ApiResponse({ status: 200, description: 'Featured products retrieved successfully', type: [ProductResponseDto] })
  async getFeaturedProducts(@Query('limit') limit: number = 10): Promise<ProductResponseDto[]> {
    return this.productsService.getFeaturedProducts(limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by name or description' })
  @ApiQuery({ name: 'q', type: String, description: 'Search term' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of results to return' })
  @ApiResponse({ status: 200, description: 'Products found successfully', type: [ProductResponseDto] })
  async searchProducts(
    @Query('q') searchTerm: string,
    @Query('limit') limit: number = 20,
  ): Promise<ProductResponseDto[]> {
    return this.productsService.searchProducts(searchTerm, limit);
  }

  @Get('low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get low stock products' })
  @ApiQuery({ name: 'threshold', type: Number, required: false, description: 'Stock threshold' })
  @ApiResponse({ status: 200, description: 'Low stock products retrieved successfully', type: [ProductResponseDto] })
  async getLowStockProducts(@Query('threshold') threshold: number = 10): Promise<ProductResponseDto[]> {
    return this.productsService.getLowStockProducts(threshold);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiParam({ name: 'categoryId', type: Number, description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category products retrieved successfully' })
  async getProductsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query() query: ProductQueryDto,
  ) {
    return this.productsService.getProductsByCategory(categoryId, query);
  }

  @Get('vendor/:vendorId')
  @ApiOperation({ summary: 'Get products by vendor' })
  @ApiParam({ name: 'vendorId', type: String, description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Vendor products retrieved successfully' })
  async getProductsByVendor(
    @Param('vendorId') vendorId: string,
    @Query() query: ProductQueryDto,
  ) {
    return this.productsService.getProductsByVendor(vendorId, query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product statistics - Admin only' })
  @ApiResponse({ status: 200, description: 'Product statistics retrieved successfully' })
  async getProductStats() {
    return this.productsService.getProductStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const vendorId = req.user.role === 'vendor' ? req.user.vendorId : undefined;
    return this.productsService.update(id, updateProductDto, vendorId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete product with order history' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<void> {
    const vendorId = req.user.role === 'vendor' ? req.user.vendorId : undefined;
    return this.productsService.remove(id, vendorId);
  }

  @Put(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product stock' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiQuery({ name: 'quantity', type: Number, description: 'Quantity to update' })
  @ApiQuery({ name: 'operation', enum: ['increase', 'decrease'], description: 'Stock operation' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Query('quantity', ParseIntPipe) quantity: number,
    @Query('operation') operation: 'increase' | 'decrease' = 'decrease',
  ): Promise<ProductResponseDto> {
    return this.productsService.updateStock(id, quantity, operation);
  }

  @Put(':id/toggle-featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle product featured status' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Featured status updated successfully', type: ProductResponseDto })
  async toggleFeatured(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return this.productsService.toggleFeatured(id);
  }
}