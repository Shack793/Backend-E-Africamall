import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import  JwtAuthGuard  from '../../common/guards/jwt-auth.guard';
import  RolesGuard  from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateVendorStatusDto, CreateProductDto, UpdateProductDto } from './dto/dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('vendors')
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  async getAllVendors() {
    return this.adminService.getAllVendors();
  }

  @Get('vendors/pending')
  @ApiOperation({ summary: 'Get pending vendors' })
  @ApiResponse({ status: 200, description: 'Pending vendors retrieved successfully' })
  async getPendingVendors() {
    return this.adminService.getPendingVendors();
  }

  @Get('vendors/:id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiParam({ name: 'id', type: String })
  async getVendorById(@Param('id') id: string) {
    return this.adminService.getVendorById(id);
  }

  @Put('vendors/:id/status')
  @ApiOperation({ summary: 'Update vendor status' })
  @ApiResponse({ status: 200, description: 'Vendor status updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateVendorStatusDto })
  async updateVendorStatus(
    @Param('id') id: string,
    @Body() updateVendorStatusDto: UpdateVendorStatusDto,
  ) {
    return this.adminService.updateVendorStatus(id, updateVendorStatusDto);
  }

  @Put('vendors/:id/approve')
  @ApiOperation({ summary: 'Approve vendor' })
  @ApiResponse({ status: 200, description: 'Vendor approved successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiParam({ name: 'id', type: String })
  async approveVendor(
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.adminService.approveVendor(id, notes);
  }

  @Put('vendors/:id/reject')
  @ApiOperation({ summary: 'Reject vendor' })
  @ApiResponse({ status: 200, description: 'Vendor rejected successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiParam({ name: 'id', type: String })
  async rejectVendor(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.adminService.rejectVendor(id, reason);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', type: String })
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', type: String })
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    return this.adminService.updateUserRole(id, role);
  }

  @Post('products')
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiBody({ type: CreateProductDto })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.adminService.createProduct(createProductDto);
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateProductDto })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.adminService.updateProduct(id, updateProductDto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: String })
  async deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }
}