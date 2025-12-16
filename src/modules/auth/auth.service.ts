import { Injectable, UnauthorizedException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';
import { Customer } from '../../entities/customer.entity';
import { Vendor } from '../../entities/vendor.entity';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, requiredRole?: string) {
    try {
      // Validate input
      if (!loginDto.email || !loginDto.password) {
        throw new BadRequestException('Email and password are required');
      }

      const user = await this.userRepo.findOne({ 
        where: { email: loginDto.email.toLowerCase().trim() } 
      });
      
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      // Check if user has the required role
      if (requiredRole && user.role !== requiredRole) {
        throw new UnauthorizedException(`This login endpoint is for ${requiredRole}s only. Your account is registered as ${user.role}`);
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { 
        email: user.email, 
        sub: user.id, 
        role: user.role,
        customerId: user.customerId,
        vendorId: user.vendorId,
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          customerId: user.customerId,
          vendorId: user.vendorId,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  async register(registerDto: RegisterDto) {
    const queryRunner = this.userRepo.manager.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!registerDto.email || !registerDto.password) {
        throw new BadRequestException('Email and password are required');
      }

      if (registerDto.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters long');
      }

      const email = registerDto.email.toLowerCase().trim();
      const existingUser = await queryRunner.manager.findOne(User, { 
        where: { email } 
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const validRoles = ['customer', 'vendor', 'admin'];
      const role = registerDto.role || 'customer';
      
      if (!validRoles.includes(role)) {
        throw new BadRequestException('Invalid role');
      }

      if ((role === 'customer' || role === 'vendor') && !registerDto.phone) {
        throw new BadRequestException('Phone number is required for customer/vendor registration');
      }


      if (registerDto.phone && !this.isValidPhoneNumber(registerDto.phone)) {
        throw new BadRequestException('Invalid phone number format');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 12);
      
      const user = queryRunner.manager.create(User, {
        email,
        password: hashedPassword,
        role,
        isActive: true,
      });

      const savedUser = await queryRunner.manager.save(User, user);

      if (role === 'customer' && registerDto.phone) {
        const existingCustomer = await queryRunner.manager.findOne(Customer, {
          where: { phone: registerDto.phone }
        });

        if (existingCustomer) {
          throw new ConflictException('Customer with this phone number already exists');
        }

        const customerName = `${registerDto.firstName || ''} ${registerDto.lastName || ''}`.trim() 
          || registerDto.email.split('@')[0];

        const customer = queryRunner.manager.create(Customer, {
          phone: registerDto.phone,
          name: customerName,
          email,
          address: registerDto.address,
          userId: savedUser.id,
          isActive: true,
        });

        const savedCustomer = await queryRunner.manager.save(Customer, customer);
        
        savedUser.customerId = Number(savedCustomer.id);
        await queryRunner.manager.save(User, savedUser);
      } 
      else if (role === 'vendor' && registerDto.phone) {
        const existingVendor = await queryRunner.manager.findOne(Vendor, {
          where: { phone: registerDto.phone }
        });

        if (existingVendor) {
          throw new ConflictException('Vendor with this phone number already exists');
        }

        if (!registerDto.businessName) {
          throw new BadRequestException('Business name is required for vendor registration');
        }

        const { v4: uuidv4 } = require('uuid');
        const vendorId = uuidv4();

        const vendor = queryRunner.manager.create(Vendor, {
          id: vendorId,
          phone: registerDto.phone,
          name: registerDto.businessName,
          email,
          isApproved: false, 
          userId: savedUser.id,
          description: registerDto.businessDescription,
          address: registerDto.address,
          city: registerDto.city,
          state: registerDto.state,
          country: registerDto.country,
          postalCode: registerDto.postalCode,
          isActive: true,
          rating: 0,
          totalProducts: 0,
        });

        const savedVendor = await queryRunner.manager.save(Vendor, vendor);
        

        savedUser.vendorId = savedVendor.id;
        await queryRunner.manager.save(User, savedUser);
      }

      await queryRunner.commitTransaction();

      const payload = { 
        email: savedUser.email, 
        sub: savedUser.id, 
        role: savedUser.role 
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: savedUser.id,
          email: savedUser.email,
          role: savedUser.role,
        },
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof BadRequestException || 
          error instanceof ConflictException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Registration failed');
    } finally {
      await queryRunner.release();
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    try {
      if (!changePasswordDto.currentPassword || 
          !changePasswordDto.newPassword || 
          !changePasswordDto.confirmNewPassword) {
        throw new BadRequestException('All password fields are required');
      }

      if (changePasswordDto.newPassword.length < 6) {
        throw new BadRequestException('New password must be at least 6 characters long');
      }

      if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword) {
        throw new BadRequestException('New passwords do not match');
      }

      if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
        throw new BadRequestException('New password must be different from current password');
      }

      const user = await this.userRepo.findOne({ 
        where: { id: userId } 
      });
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword, 
        user.password
      );

      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);
      
      user.password = hashedNewPassword;
      user.updatedAt = new Date();
      await this.userRepo.save(user);

      return { message: 'Password changed successfully' };

    } catch (error) {
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Password change failed');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userRepo.findOne({ 
        where: { email: email.toLowerCase().trim() } 
      });
      
      if (user && 
          user.isActive && 
          await bcrypt.compare(password, user.password)) {
        const { password: _, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  async getUserProfile(userId: string) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['customer', 'vendor'],
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        customer: user.customer,
        vendor: user.vendor,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user profile');
    }
  }
}