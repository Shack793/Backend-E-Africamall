import { Controller, Post, Body, UseGuards, Request, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto';
import JwtAuthGuard from '../../common/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ==================== CUSTOMER ENDPOINTS ====================
  @Post('customer/login')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Customer login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async customerLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, 'customer');
  }

  @Post('customer/register')
  @ApiOperation({ summary: 'Customer registration' })
  @ApiResponse({ status: 201, description: 'Customer registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiBody({ type: RegisterDto })
  async customerRegister(@Body() registerDto: RegisterDto) {
    return this.authService.register({ ...registerDto, role: 'customer' });
  }

  // ==================== VENDOR ENDPOINTS ====================
  @Post('vendor/login')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Vendor login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async vendorLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, 'vendor');
  }

  @Post('vendor/register')
  @ApiOperation({ summary: 'Vendor registration' })
  @ApiResponse({ status: 201, description: 'Vendor registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email or phone already exists' })
  @ApiBody({ type: RegisterDto })
  async vendorRegister(@Body() registerDto: RegisterDto) {
    return this.authService.register({ ...registerDto, role: 'vendor' });
  }

  // ==================== ADMIN ENDPOINTS ====================
  @Post('admin/login')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, 'admin');
  }

  @Post('admin/register')
  @ApiOperation({ summary: 'Admin registration (Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiBody({ type: RegisterDto })
  async adminRegister(@Body() registerDto: RegisterDto) {
    return this.authService.register({ ...registerDto, role: 'admin' });
  }

  // ==================== GENERAL ENDPOINTS ====================
  @Post('login')
  @HttpCode(200) 
  @ApiOperation({ summary: 'User login (generic)' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration (generic - defaults to customer)' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto, req.user.userId);
  }
}