import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../../entities/vendor.entity';
import { User } from '../../entities/user.entity';
import { Product } from '../../entities/product.entity';
import { Order } from '../../entities/order.entity';
import { CreateProductDto, UpdateProductDto, UpdateVendorStatusDto } from './dto/dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, // This was missing
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async getAllVendors() {
    return await this.vendorRepo.find({
      relations: ['user'],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isApproved: true,
        createdAt: true,
        user: {
          id: true,
          email: true,
          role: true,
        },
      },
    });
  }

  async getVendorById(id: string) {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: ['user', 'products'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async updateVendorStatus(id: string, updateVendorStatusDto: UpdateVendorStatusDto) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    vendor.isApproved = updateVendorStatusDto.isApproved;
    
    // Only update approvalNotes if provided
    if (updateVendorStatusDto.approvalNotes !== undefined) {
      vendor.approvalNotes = updateVendorStatusDto.approvalNotes;
    }

    return await this.vendorRepo.save(vendor);
  }

  async getDashboardStats() {
    const [
      totalVendors,
      totalCustomers,
      totalProducts,
      totalOrders,
      pendingVendors,
      recentOrders,
    ] = await Promise.all([
      this.vendorRepo.count(),
      this.userRepo.count({ where: { role: 'customer' } }),
      this.productRepo.count(),
      this.orderRepo.count(),
      this.vendorRepo.count({ where: { isApproved: false } }),
      this.orderRepo.find({
        take: 10,
        order: { createdAt: 'DESC' },
        relations: ['customer'],
      }),
    ]);

    return {
      totals: {
        vendors: totalVendors,
        customers: totalCustomers,
        products: totalProducts,
        orders: totalOrders,
        pendingVendors,
      },
      recentOrders,
      chartData: await this.getChartData(),
    };
  }

  private async getChartData() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.createdAt >= :date', { date: thirtyDaysAgo })
      .select('DATE(order.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('DATE(order.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      orders: recentOrders,
    };
  }

  // Product management methods
  async createProduct(createProductDto: CreateProductDto) {
    // Verify vendor exists
    const vendor = await this.vendorRepo.findOne({ 
      where: { id: String(createProductDto.vendorId) } 
    });
    
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${createProductDto.vendorId} not found`);
    }

    const { vendorId, ...rest } = createProductDto;
    const product = this.productRepo.create({
      ...rest,
      vendorId: vendor.id,
    });
    return await this.productRepo.save(product);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id: Number(id) } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto);
    return await this.productRepo.save(product);
  }

  async deleteProduct(id: string) {
    const result = await this.productRepo.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  // Additional admin methods
  async getPendingVendors() {
    return await this.vendorRepo.find({
      where: { isApproved: false },
      relations: ['user'],
    });
  }

  async approveVendor(id: string, notes?: string) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    vendor.isApproved = true;
    if (notes) {
      vendor.approvalNotes = notes;
    }
    return await this.vendorRepo.save(vendor);
  }

  async rejectVendor(id: string, reason: string) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    vendor.isApproved = false;
    vendor.approvalNotes = reason;
    return await this.vendorRepo.save(vendor);
  }

  // User management methods
  async getAllUsers() {
    return await this.userRepo.find({
      select: ['id', 'email', 'role', 'createdAt', 'updatedAt']
    });
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findOne({ 
      where: { id },
      relations: ['vendor'] 
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateUserRole(id: string, role: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.role = role;
    return await this.userRepo.save(user);
  }
}