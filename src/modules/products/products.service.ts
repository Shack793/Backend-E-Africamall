import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like, Between, FindOptionsWhere, MoreThan, LessThanOrEqual } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { Vendor } from '../../entities/vendor.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
  ) {}

  private toProductResponseDto(product: Product): ProductResponseDto {
    if (!product) {
      throw new BadRequestException('Product cannot be null');
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price?.toString() || '0'),
      image: product.image,
      stock: product.stock,
      isFeatured: product.isFeatured,
      categoryId: product.categoryId,
      vendorId: product.vendorId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        description: product.category.description,
        image: product.category.image,
      } : undefined,
      vendor: product.vendor ? {
        id: product.vendor.id,
        name: product.vendor.name,
        email: product.vendor.email,
        isApproved: product.vendor.isApproved,
      } : undefined,
      variations: product.variations?.map(variation => ({
        id: variation.id,
        name: variation.name,
        price: parseFloat(variation.price?.toString() || '0'),
        stock: variation.stock,
        createdAt: variation.createdAt,
        updatedAt: variation.updatedAt,
      })) || [],
      reviews: product.reviews?.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      })) || [],
    };
  }

  async create(createProductDto: CreateProductDto, vendorId?: string): Promise<ProductResponseDto> {
    const existingProduct = await this.productRepo.findOne({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
    }

    if (createProductDto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: createProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${createProductDto.categoryId} not found`);
      }
    }

    if (createProductDto.vendorId) {
      const vendor = await this.vendorRepo.findOne({
        where: { id: createProductDto.vendorId },
      });

      if (!vendor) {
        throw new NotFoundException(`Vendor with ID ${createProductDto.vendorId} not found`);
      }

      if (!vendor.isApproved) {
        throw new BadRequestException('Cannot create product for unapproved vendor');
      }
    }

    const finalVendorId = vendorId || createProductDto.vendorId;

    if (!finalVendorId) {
      throw new BadRequestException('Vendor ID is required');
    }

    const finalVendor = await this.vendorRepo.findOne({
      where: { id: finalVendorId },
    });

    if (!finalVendor) {
      throw new NotFoundException(`Vendor with ID ${finalVendorId} not found`);
    }

    if (!finalVendor.isApproved) {
      throw new BadRequestException('Cannot create product for unapproved vendor');
    }

    const product = this.productRepo.create({
      ...createProductDto,
      vendorId: finalVendorId,
    });

    const savedProduct = await this.productRepo.save(product);
    
    const completeProduct = await this.productRepo.findOne({
      where: { id: savedProduct.id },
      relations: ['category', 'vendor', 'variations', 'reviews'],
    });

    if (!completeProduct) {
      throw new NotFoundException(`Product with ID ${savedProduct.id} not found`);
    }

    return this.toProductResponseDto(completeProduct);
  }

  async findAll(query: ProductQueryDto): Promise<{
    products: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      categoryId,
      vendorId,
      minPrice,
      maxPrice,
      search,
      isFeatured,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Product> = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = Between(
        minPrice !== undefined ? minPrice : 0,
        maxPrice !== undefined ? maxPrice : 999999
      );
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (inStock !== undefined) {
      if (inStock) {
        where.stock = MoreThan(0);
      } else {
        where.stock = 0;
      }
    }

    if (search) {
      where.name = Like(`%${search}%`);
    }

    const order: any = {};
    order[sortBy] = sortOrder.toUpperCase();

    const [products, total] = await this.productRepo.findAndCount({
      where,
      relations: ['category', 'vendor', 'variations', 'reviews'],
      order,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      products: products.map(product => this.toProductResponseDto(product)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'vendor', 'variations', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.toProductResponseDto(product);
  }

  async findByIds(ids: number[]): Promise<ProductResponseDto[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const products = await this.productRepo.find({
      where: { id: In(ids) },
      relations: ['category', 'vendor', 'variations', 'reviews'],
    });

    return products.map(product => this.toProductResponseDto(product));
  }

  async update(id: number, updateProductDto: UpdateProductDto, vendorId?: string): Promise<ProductResponseDto> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'vendor', 'variations', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (vendorId && product.vendorId !== vendorId) {
      throw new BadRequestException('You can only update your own products');
    }

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const existingProduct = await this.productRepo.findOne({
        where: { name: updateProductDto.name },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('Product with this name already exists');
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

    if (updateProductDto.vendorId) {
      const vendor = await this.vendorRepo.findOne({
        where: { id: updateProductDto.vendorId },
      });

      if (!vendor) {
        throw new NotFoundException(`Vendor with ID ${updateProductDto.vendorId} not found`);
      }

      if (!vendor.isApproved) {
        throw new BadRequestException('Cannot assign product to unapproved vendor');
      }
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepo.save(product);

    const completeProduct = await this.productRepo.findOne({
      where: { id: updatedProduct.id },
      relations: ['category', 'vendor', 'variations', 'reviews'],
    });

    if (!completeProduct) {
      throw new NotFoundException(`Product with ID ${updatedProduct.id} not found`);
    }

    return this.toProductResponseDto(completeProduct);
  }

  async remove(id: number, vendorId?: string): Promise<void> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['orderDetails', 'category', 'vendor', 'variations', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (vendorId && product.vendorId !== vendorId) {
      throw new BadRequestException('You can only delete your own products');
    }

    if (Array.isArray(product.orderDetails) && product.orderDetails.length > 0) {
      throw new ConflictException('Cannot delete product with order history. Deactivate it instead.');
    }

    await this.productRepo.remove(product);
  }

  async updateStock(id: number, quantity: number, operation: 'increase' | 'decrease' = 'decrease'): Promise<ProductResponseDto> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (operation === 'decrease') {
      if (product.stock < quantity) {
        throw new BadRequestException(`Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`);
      }
      product.stock -= quantity;
    } else {
      product.stock += quantity;
    }

    const updatedProduct = await this.productRepo.save(product);
    
    const completeProduct = await this.productRepo.findOne({
      where: { id: updatedProduct.id },
      relations: ['category', 'vendor', 'variations', 'reviews'],
    });

    if (!completeProduct) {
      throw new NotFoundException(`Product with ID ${updatedProduct.id} not found`);
    }

    return this.toProductResponseDto(completeProduct);
  }

  async toggleFeatured(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await this.productRepo.save(product);
    
    const completeProduct = await this.productRepo.findOne({
      where: { id: updatedProduct.id },
      relations: ['category', 'vendor', 'variations', 'reviews'],
    });

    if (!completeProduct) {
      throw new NotFoundException(`Product with ID ${updatedProduct.id} not found`);
    }

    return this.toProductResponseDto(completeProduct);
  }

  async getFeaturedProducts(limit: number = 10): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.find({
      where: { isFeatured: true, stock: MoreThan(0) },
      relations: ['category', 'vendor', 'variations', 'reviews'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return products.map(product => this.toProductResponseDto(product));
  }

  async getProductsByCategory(categoryId: number, query: ProductQueryDto): Promise<{
    products: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return this.findAll({
      ...query,
      categoryId,
    });
  }

  async getProductsByVendor(vendorId: string, query: ProductQueryDto): Promise<{
    products: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    return this.findAll({
      ...query,
      vendorId,
    });
  }

  async searchProducts(searchTerm: string, limit: number = 20): Promise<ProductResponseDto[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new BadRequestException('Search term is required');
    }

    const products = await this.productRepo.find({
      where: [
        { name: Like(`%${searchTerm}%`) },
        { description: Like(`%${searchTerm}%`) },
      ],
      relations: ['category', 'vendor', 'variations', 'reviews'],
      order: { name: 'ASC' },
      take: limit,
    });

    return products.map(product => this.toProductResponseDto(product));
  }

  async getLowStockProducts(threshold: number = 10): Promise<ProductResponseDto[]> {
    if (threshold < 0) {
      throw new BadRequestException('Threshold must be a non-negative number');
    }

    const products = await this.productRepo.find({
      where: { stock: LessThanOrEqual(threshold) },
      relations: ['category', 'vendor', 'variations', 'reviews'],
      order: { stock: 'ASC' },
    });

    return products.map(product => this.toProductResponseDto(product));
  }

  async getProductStats() {
    const totalProducts = await this.productRepo.count();
    const totalInStock = await this.productRepo.count({ where: { stock: MoreThan(0) } });
    const totalOutOfStock = await this.productRepo.count({ where: { stock: 0 } });
    const featuredProducts = await this.productRepo.count({ where: { isFeatured: true } });

    const categoryStats = await this.productRepo
      .createQueryBuilder('product')
      .select('category.name', 'categoryName')
      .addSelect('COUNT(*)', 'count')
      .leftJoin('product.category', 'category')
      .groupBy('category.name')
      .getRawMany();

    const vendorStats = await this.productRepo
      .createQueryBuilder('product')
      .select('vendor.name', 'vendorName')
      .addSelect('COUNT(*)', 'count')
      .leftJoin('product.vendor', 'vendor')
      .groupBy('vendor.name')
      .getRawMany();

    return {
      totalProducts,
      totalInStock,
      totalOutOfStock,
      featuredProducts,
      categoryStats,
      vendorStats,
    };
  }
}