import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto, CustomerResponseDto } from './dto';
import JwtAuthGuard from '../../common/guards/jwt-auth.guard';

@ApiTags('Customer')
@Controller('customer')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get customer profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: CustomerResponseDto })
  async getProfile(@Req() req: any): Promise<CustomerResponseDto> {
    const customerId = req.user.customerId; 
    return this.customerService.getProfile(customerId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update customer profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully', type: CustomerResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    const customerId = req.user.customerId; 
    return this.customerService.updateProfile(customerId, updateProfileDto);
  }
}