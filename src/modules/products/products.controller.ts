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

  // ✅ Admin & Vendor can create
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: ProductResponseDto })
  async create(@Request() req, @Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const vendorId = req.user.role === 'vendor' ? req.user.vendorId : undefined;
    return this.productsService.create(createProductDto, vendorId);
  }

  // Public routes
  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('featured')
  async getFeaturedProducts(@Query('limit') limit: number = 10): Promise<ProductResponseDto[]> {
    return this.productsService.getFeaturedProducts(limit);
  }

  @Get('search')
  async searchProducts(@Query('q') searchTerm: string, @Query('limit') limit: number = 20): Promise<ProductResponseDto[]> {
    return this.productsService.searchProducts(searchTerm, limit);
  }

  // ✅ Admin & Vendor can view low stock
  @Get('low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  async getLowStockProducts(@Query('threshold') threshold: number = 10): Promise<ProductResponseDto[]> {
    return this.productsService.getLowStockProducts(threshold);
  }

  @Get('category/:categoryId')
  async getProductsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number, @Query() query: ProductQueryDto) {
    return this.productsService.getProductsByCategory(categoryId, query);
  }

  @Get('vendor/:vendorId')
  async getProductsByVendor(@Param('vendorId') vendorId: string, @Query() query: ProductQueryDto) {
    return this.productsService.getProductsByVendor(vendorId, query);
  }

  // ✅ Admin only route
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  async getProductStats() {
    return this.productsService.getProductStats();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }

  // ✅ Admin & Vendor can update
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  async update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const vendorId = req.user.role === 'vendor' ? req.user.vendorId : undefined;
    return this.productsService.update(id, updateProductDto, vendorId);
  }

  // ✅ Admin & Vendor can delete
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    const vendorId = req.user.role === 'vendor' ? req.user.vendorId : undefined;
    return this.productsService.remove(id, vendorId);
  }

  // ✅ Admin & Vendor can update stock
  @Put(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  async updateStock(@Param('id', ParseIntPipe) id: number, @Query('quantity', ParseIntPipe) quantity: number, @Query('operation') operation: 'increase' | 'decrease' = 'decrease'): Promise<ProductResponseDto> {
    return this.productsService.updateStock(id, quantity, operation);
  }

  // ✅ Admin & Vendor can toggle featured
  @Put(':id/toggle-featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'vendor')
  @ApiBearerAuth()
  async toggleFeatured(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return this.productsService.toggleFeatured(id);
  }
}
