import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { Category } from '../../entities/category.entity';
import { BusinessSetting } from '../../entities/business-setting.entity';

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(BusinessSetting)
    private readonly settingRepo: Repository<BusinessSetting>,
  ) {}

  async getFeaturedProducts() {
    return this.productRepo.find({
      where: { isFeatured: true },
      take: 10,
      relations: ['category', 'vendor'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllCategories() {
    return this.categoryRepo.find({
      order: { name: 'ASC' },
    });
  }

  async getProductsByCategory(categoryId: number) {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });

    if (!category) throw new NotFoundException('Category not found');

    return this.productRepo.find({
      where: { category: { id: categoryId } },
      relations: ['vendor'],
      take: 20,
      order: { createdAt: 'DESC' },
    });
  }

  async getBusinessSettings() {
    const settings = await this.settingRepo.find();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }

  async searchProducts(query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return this.productRepo.find({
      where: [
        { name: ILike(`%${query}%`) },
        { description: ILike(`%${query}%`) },
      ],
      take: 15,
      order: { createdAt: 'DESC' },
    });
  }
}
