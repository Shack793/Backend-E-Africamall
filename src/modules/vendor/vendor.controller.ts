import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
  Delete,
  Query
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';
import { VendorsService } from './vendor.service';
import { CreateVendorProductDto } from './dto/create-vendor-products.dto';
import { UpdateVendorProfileDto } from './dto/update-vendor-profile.dto';
import  JwtAuthGuard  from '../../common/guards/jwt-auth.guard';
import  RolesGuard  from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Vendor')
@Controller('vendor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('vendor')
@ApiBearerAuth()
export class VendorController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get vendor profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async getProfile(@Request() req) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.vendorsService.findOne(vendorId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update vendor profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiBody({ type: UpdateVendorProfileDto })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateVendorProfileDto
  ) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.vendorsService.update(vendorId, updateProfileDto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get vendor products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProducts(@Request() req) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.vendorsService.getVendorProducts(vendorId);
  }

  @Post('products')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Product with this name already exists' })
  @ApiBody({ type: CreateVendorProductDto })
  async createProduct(
    @Request() req,
    @Body() createProductDto: CreateVendorProductDto
  ) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.vendorsService.createVendorProduct(vendorId, createProductDto);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get vendor product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: Number })
  async getProduct(
    @Request() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.vendorsService.getVendorProductById(vendorId, id);
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Update vendor product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: CreateVendorProductDto })
  async updateProduct(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: CreateVendorProductDto
  ) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.vendorsService.updateVendorProduct(vendorId, id, updateProductDto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete vendor product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: Number })
  async deleteProduct(
    @Request() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.vendorsService.deleteVendorProduct(vendorId, id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get vendor statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStats(@Request() req) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.vendorsService.getVendorStats(vendorId);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get vendor dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDashboard(@Request() req) {
    const vendorId = req.user.vendorId || req.user.id;
    return this.vendorsService.getVendorDashboard(vendorId);
  }
}