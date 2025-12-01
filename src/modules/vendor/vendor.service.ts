import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like, FindOptionsWhere, MoreThan, LessThanOrEqual } from 'typeorm';
import { Vendor } from '../../entities/vendor.entity';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { CreateVendorProductDto } from './dto/create-vendor-products.dto';
import { UpdateVendorProfileDto } from './dto/update-vendor-profile.dto';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  private toVendorResponseDto(vendor: Vendor): VendorResponseDto {
    if (!vendor) {
      throw new BadRequestException('Vendor cannot be null');
    }

    return {
      id: vendor.id,
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      city: vendor.city,
      state: vendor.state,
      country: vendor.country,
      postalCode: vendor.postalCode,
      description: vendor.description,
      logo: vendor.logo,
      website: vendor.website,
      isApproved: vendor.isApproved,
      isActive: vendor.isActive,
      rating: vendor.rating,
      totalProducts: vendor.totalProducts,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
      user: vendor.user ? {
        id: vendor.user.id,
        email: vendor.user.email,
   
        role: vendor.user.role,
      } : undefined,
      products: vendor.products?.map(product => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price?.toString() || '0'),
        stock: product.stock,
        isFeatured: product.isFeatured,
        image: product.image,
      })) || [],
    };
  }

  async create(createVendorDto: CreateVendorDto): Promise<VendorResponseDto> {
    const existingVendor = await this.vendorRepo.findOne({
      where: { email: createVendorDto.email },
    });

    if (existingVendor) {
      throw new ConflictException('Vendor with this email already exists');
    }


    const existingVendorByName = await this.vendorRepo.findOne({
      where: { name: createVendorDto.name },
    });

    if (existingVendorByName) {
      throw new ConflictException('Vendor with this name already exists');
    }

    const vendor = this.vendorRepo.create({
      ...createVendorDto,
      isApproved: false, 
      isActive: true,
    });

    const savedVendor = await this.vendorRepo.save(vendor);
    

    const completeVendor = await this.vendorRepo.findOne({
      where: { id: savedVendor.id },
      relations: ['user', 'products'],
    });

    if (!completeVendor) {
      throw new NotFoundException('Vendor not found after creation');
    }

    return this.toVendorResponseDto(completeVendor);
  }

  async findAll(query: VendorQueryDto): Promise<{
    vendors: VendorResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      isApproved,
      isActive,
      minRating,
      city,
      state,
      country,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const skip = (page - 1) * limit;


    const where: FindOptionsWhere<Vendor> = {};

    if (isApproved !== undefined) {
      where.isApproved = isApproved;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (minRating !== undefined) {
      where.rating = MoreThan(minRating);
    }

    if (city) {
      where.city = Like(`%${city}%`);
    }

    if (state) {
      where.state = Like(`%${state}%`);
    }

    if (country) {
      where.country = Like(`%${country}%`);
    }

    if (search) {
      where.name = Like(`%${search}%`);
    }


    const order: any = {};
    order[sortBy] = sortOrder.toUpperCase();

    const [vendors, total] = await this.vendorRepo.findAndCount({
      where,
      relations: ['user', 'products'],
      order,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      vendors: vendors.map(vendor => this.toVendorResponseDto(vendor)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<VendorResponseDto> {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: ['user', 'products'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return this.toVendorResponseDto(vendor);
  }

  async findByEmail(email: string): Promise<VendorResponseDto> {
    const vendor = await this.vendorRepo.findOne({
      where: { email },
      relations: ['user', 'products'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with email ${email} not found`);
    }

    return this.toVendorResponseDto(vendor);
  }

  async findByIds(ids: string[]): Promise<VendorResponseDto[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const vendors = await this.vendorRepo.find({
      where: { id: In(ids) },
      relations: ['user', 'products'],
    });

    return vendors.map(vendor => this.toVendorResponseDto(vendor));
  }

  async update(id: string, updateVendorDto: UpdateVendorProfileDto): Promise<VendorResponseDto> {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: ['user', 'products'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    
    if (updateVendorDto.email && updateVendorDto.email !== vendor.email) {
      const existingVendor = await this.vendorRepo.findOne({
        where: { email: updateVendorDto.email },
      });

      if (existingVendor && existingVendor.id !== id) {
        throw new ConflictException('Vendor with this email already exists');
      }
    }

    
    if (updateVendorDto.name && updateVendorDto.name !== vendor.name) {
      const existingVendor = await this.vendorRepo.findOne({
        where: { name: updateVendorDto.name },
      });

      if (existingVendor && existingVendor.id !== id) {
        throw new ConflictException('Vendor with this name already exists');
      }
    }


    Object.assign(vendor, updateVendorDto);
    const updatedVendor = await this.vendorRepo.save(vendor);

    const completeVendor = await this.vendorRepo.findOne({
      where: { id: updatedVendor.id },
      relations: ['user', 'products'],
    });

    if (!completeVendor) {
      throw new NotFoundException(`Vendor with ID ${updatedVendor.id} not found after update`);
    }

    return this.toVendorResponseDto(completeVendor);
  }

  async remove(id: string): Promise<void> {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }


    if (vendor.products && vendor.products.length > 0) {
      throw new ConflictException('Cannot delete vendor with existing products. Deactivate instead.');
    }

    await this.vendorRepo.remove(vendor);
  }

  async approveVendor(id: string): Promise<VendorResponseDto> {
    const vendor = await this.vendorRepo.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    if (vendor.isApproved) {
      throw new BadRequestException('Vendor is already approved');
    }

    vendor.isApproved = true;
    vendor.isActive = true;
    
    const updatedVendor = await this.vendorRepo.save(vendor);
    

    const completeVendor = await this.vendorRepo.findOne({
      where: { id: updatedVendor.id },
      relations: ['user', 'products'],
    });

    if (!completeVendor) {
      throw new NotFoundException(`Vendor with ID ${updatedVendor.id} not found after approval`);
    }

    return this.toVendorResponseDto(completeVendor);
  }

  async rejectVendor(id: string): Promise<VendorResponseDto> {
    const vendor = await this.vendorRepo.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    vendor.isApproved = false;
    const updatedVendor = await this.vendorRepo.save(vendor);
    

    const completeVendor = await this.vendorRepo.findOne({
      where: { id: updatedVendor.id },
      relations: ['user', 'products'],
    });

    if (!completeVendor) {
      throw new NotFoundException(`Vendor with ID ${updatedVendor.id} not found after rejection`);
    }

    return this.toVendorResponseDto(completeVendor);
  }

  async toggleActive(id: string): Promise<VendorResponseDto> {
    const vendor = await this.vendorRepo.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    vendor.isActive = !vendor.isActive;
    const updatedVendor = await this.vendorRepo.save(vendor);
    

    const completeVendor = await this.vendorRepo.findOne({
      where: { id: updatedVendor.id },
      relations: ['user', 'products'],
    });

    if (!completeVendor) {
      throw new NotFoundException(`Vendor with ID ${updatedVendor.id} not found after toggle`);
    }

    return this.toVendorResponseDto(completeVendor);
  }

  async updateRating(id: string, newRating: number): Promise<VendorResponseDto> {
    if (newRating < 0 || newRating > 5) {
      throw new BadRequestException('Rating must be between 0 and 5');
    }

    const vendor = await this.vendorRepo.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

   
    vendor.rating = newRating;
    const updatedVendor = await this.vendorRepo.save(vendor);

    const completeVendor = await this.vendorRepo.findOne({
      where: { id: updatedVendor.id },
      relations: ['user', 'products'],
    });

    if (!completeVendor) {
      throw new NotFoundException(`Vendor with ID ${updatedVendor.id} not found after rating update`);
    }

    return this.toVendorResponseDto(completeVendor);
  }


  async getVendorProducts(id: string): Promise<any[]> {
    const vendor = await this.vendorRepo.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    const products = await this.productRepo.find({
      where: { vendorId: id },
      relations: ['category', 'variations'],
      order: { createdAt: 'DESC' },
    });

    return products.map(product => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price?.toString() || '0'),
      stock: product.stock,
      isFeatured: product.isFeatured,
      image: product.image,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
      } : null,
      variations: product.variations?.map(variation => ({
        id: variation.id,
        name: variation.name,
        price: parseFloat(variation.price?.toString() || '0'),
        stock: variation.stock,
      })) || [],
    }));
  }



  async createVendorProduct(vendorId: string, createProductDto: CreateVendorProductDto): Promise<any> {

    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    if (!vendor.isApproved) {
      throw new BadRequestException('Cannot create product for unapproved vendor');
    }


    const existingProduct = await this.productRepo.findOne({
      where: { 
        name: createProductDto.name,
        vendorId: vendorId 
      },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists for your vendor account');
    }


    if (createProductDto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: createProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${createProductDto.categoryId} not found`);
      }
    }

    const product = this.productRepo.create({
      ...createProductDto,
      vendorId: vendorId,
    });

    const savedProduct = await this.productRepo.save(product);

    const completeProduct = await this.productRepo.findOne({
      where: { id: savedProduct.id },
      relations: ['category', 'vendor', 'variations'],
    });

    if (!completeProduct) {
      throw new NotFoundException(`Product with ID ${savedProduct.id} not found after creation`);
    }

    return {
      id: completeProduct.id,
      name: completeProduct.name,
      description: completeProduct.description,
      price: parseFloat(completeProduct.price?.toString() || '0'),
      image: completeProduct.image,
      stock: completeProduct.stock,
      isFeatured: completeProduct.isFeatured,
      category: completeProduct.category ? {
        id: completeProduct.category.id,
        name: completeProduct.category.name,
      } : null,
      variations: completeProduct.variations?.map(variation => ({
        id: variation.id,
        name: variation.name,
        price: parseFloat(variation.price?.toString() || '0'),
        stock: variation.stock,
      })) || [],
    };
  }

  async getVendorProductById(vendorId: string, productId: number): Promise<any> {
    const product = await this.productRepo.findOne({
      where: { 
        id: productId, 
        vendorId: vendorId 
      },
      relations: ['category', 'vendor', 'variations'],
    });

    if (!product) {
      throw new NotFoundException('Product not found or you do not have permission to access it');
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price?.toString() || '0'),
      image: product.image,
      stock: product.stock,
      isFeatured: product.isFeatured,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
      } : null,
      variations: product.variations?.map(variation => ({
        id: variation.id,
        name: variation.name,
        price: parseFloat(variation.price?.toString() || '0'),
        stock: variation.stock,
      })) || [],
    };
  }

  async updateVendorProduct(vendorId: string, productId: number, updateProductDto: CreateVendorProductDto): Promise<any> {
    const product = await this.productRepo.findOne({
      where: { 
        id: productId, 
        vendorId: vendorId 
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found or you do not have permission to update it');
    }

    
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const existingProduct = await this.productRepo.findOne({
        where: { 
          name: updateProductDto.name,
          vendorId: vendorId 
        },
      });

      if (existingProduct && existingProduct.id !== productId) {
        throw new ConflictException('Product with this name already exists for your vendor account');
      }
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${updateProductDto.categoryId} not found`);
      }
    }


    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepo.save(product);

    const completeProduct = await this.productRepo.findOne({
      where: { id: updatedProduct.id },
      relations: ['category', 'vendor', 'variations'],
    });

    if (!completeProduct) {
      throw new NotFoundException(`Product with ID ${updatedProduct.id} not found after update`);
    }

    return {
      id: completeProduct.id,
      name: completeProduct.name,
      description: completeProduct.description,
      price: parseFloat(completeProduct.price?.toString() || '0'),
      image: completeProduct.image,
      stock: completeProduct.stock,
      isFeatured: completeProduct.isFeatured,
      category: completeProduct.category ? {
        id: completeProduct.category.id,
        name: completeProduct.category.name,
      } : null,
      variations: completeProduct.variations?.map(variation => ({
        id: variation.id,
        name: variation.name,
        price: parseFloat(variation.price?.toString() || '0'),
        stock: variation.stock,
      })) || [],
    };
  }

  async deleteVendorProduct(vendorId: string, productId: number): Promise<void> {
    const product = await this.productRepo.findOne({
      where: { 
        id: productId, 
        vendorId: vendorId 
      },
      relations: ['orderDetails'],
    });

    if (!product) {
      throw new NotFoundException('Product not found or you do not have permission to delete it');
    }

    if (Array.isArray(product.orderDetails) && product.orderDetails.length > 0) {
      throw new ConflictException('Cannot delete product with order history. Deactivate it instead.');
    }

    await this.productRepo.remove(product);
  }

  async getVendorOrders(vendorId: string, query: any = {}): Promise<any> {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

   
    const orderQuery = this.productRepo
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.orderDetails', 'orderDetails')
      .innerJoinAndSelect('orderDetails.order', 'order')
      .where('product.vendorId = :vendorId', { vendorId });

    if (status) {
      orderQuery.andWhere('order.status = :status', { status });
    }

    const [orders, total] = await orderQuery
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      orders: orders.flatMap(product => 
        Array.isArray(product.orderDetails)
          ? product.orderDetails.map(orderDetail => ({
              id: orderDetail.order.id,
              orderNumber: orderDetail.order.orderNumber,
              status: orderDetail.order.status,
              total: orderDetail.order.total,
              createdAt: orderDetail.order.createdAt,
              product: {
                id: product.id,
                name: product.name,
                quantity: orderDetail.quantity,
                price: orderDetail.price,
              }
            }))
          : []
      ),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getVendorDashboard(vendorId: string): Promise<any> {
    const stats = await this.getVendorStats(vendorId);
    
    const recentOrders = await this.getVendorOrders(vendorId, { limit: 5 });
    
    const lowStockProducts = await this.productRepo.find({
      where: { 
        vendorId: vendorId, 
        stock: LessThanOrEqual(10) 
      },
      take: 5,
      order: { stock: 'ASC' }
    });

    const recentProducts = await this.productRepo.find({
      where: { vendorId: vendorId },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      stats,
      recentOrders: recentOrders.orders,
      lowStockProducts: lowStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        image: product.image,
      })),
      recentProducts: recentProducts.map(product => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price?.toString() || '0'),
        stock: product.stock,
        image: product.image,
      })),
    };
  }

  async getVendorStats(id: string) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    const totalProducts = await this.productRepo.count({ where: { vendorId: id } });
    const featuredProducts = await this.productRepo.count({ 
      where: { vendorId: id, isFeatured: true } 
    });
    const outOfStockProducts = await this.productRepo.count({ 
      where: { vendorId: id, stock: 0 } 
    });
    const lowStockProducts = await this.productRepo.count({ 
      where: { vendorId: id, stock: LessThanOrEqual(10) } 
    });

    const revenueResult = await this.productRepo
      .createQueryBuilder('product')
      .select('SUM(product.price)', 'totalRevenue')
      .where('product.vendorId = :vendorId', { vendorId: id })
      .getRawOne();

    return {
      totalProducts,
      featuredProducts,
      outOfStockProducts,
      lowStockProducts,
      totalRevenue: parseFloat(revenueResult?.totalRevenue || '0'),
      rating: vendor.rating,
      isApproved: vendor.isApproved,
      isActive: vendor.isActive,
    };
  }

  async getPendingVendors(): Promise<VendorResponseDto[]> {
    const vendors = await this.vendorRepo.find({
      where: { isApproved: false },
      relations: ['user', 'products'],
      order: { createdAt: 'ASC' },
    });

    return vendors.map(vendor => this.toVendorResponseDto(vendor));
  }

  async getTopVendors(limit: number = 10): Promise<VendorResponseDto[]> {
    const vendors = await this.vendorRepo.find({
      where: { isApproved: true, isActive: true, rating: MoreThan(4) },
      relations: ['user', 'products'],
      order: { rating: 'DESC', totalProducts: 'DESC' },
      take: limit,
    });

    return vendors.map(vendor => this.toVendorResponseDto(vendor));
  }

  async searchVendors(searchTerm: string, limit: number = 20): Promise<VendorResponseDto[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new BadRequestException('Search term is required');
    }

    const vendors = await this.vendorRepo.find({
      where: [
        { name: Like(`%${searchTerm}%`) },
        { email: Like(`%${searchTerm}%`) },
        { city: Like(`%${searchTerm}%`) },
        { state: Like(`%${searchTerm}%`) },
      ],
      relations: ['user', 'products'],
      order: { name: 'ASC' },
      take: limit,
    });

    return vendors.map(vendor => this.toVendorResponseDto(vendor));
  }

  async getVendorsByLocation(city?: string, state?: string, country?: string): Promise<VendorResponseDto[]> {
    const where: FindOptionsWhere<Vendor> = { isApproved: true, isActive: true };

    if (city) {
      where.city = Like(`%${city}%`);
    }

    if (state) {
      where.state = Like(`%${state}%`);
    }

    if (country) {
      where.country = Like(`%${country}%`);
    }

    const vendors = await this.vendorRepo.find({
      where,
      relations: ['user', 'products'],
      order: { name: 'ASC' },
    });

    return vendors.map(vendor => this.toVendorResponseDto(vendor));
  }
}