import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto, CategoryResponseDto } from './dto';

@Injectable()
export class CategoriesService {
  deactivate(id: number): CategoryResponseDto | PromiseLike<CategoryResponseDto> {
      throw new Error('Method not implemented.');
  }
  activate(id: number): CategoryResponseDto | PromiseLike<CategoryResponseDto> {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  private toCategoryResponseDto(category: Category): CategoryResponseDto {
    return {
    id: category.id,
    name: category.name,
    description: category.description,
    image: category.image,
    createdAt: category.createdAt ?? new Date(),
    updatedAt: category.updatedAt ?? new Date(),
    productCount: category.products?.length ?? 0
};
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const existingCategory = await this.categoryRepo.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoryRepo.create(createCategoryDto);
    const savedCategory = await this.categoryRepo.save(category);
    return this.toCategoryResponseDto(savedCategory);
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepo.find({
      relations: ['products'],
      order: { name: 'ASC' },
    });
    return categories.map(category => this.toCategoryResponseDto(category));
  }

  async findAllWithProducts(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepo.find({
      relations: ['products'],
      order: { name: 'ASC' },
    });
    return categories.map(category => this.toCategoryResponseDto(category));
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.toCategoryResponseDto(category);
  }

  async update(id: number, updateCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepo.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoryRepo.save(category);
    return this.toCategoryResponseDto(updatedCategory);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.products && category.products.length > 0) {
      throw new ConflictException('Cannot delete category that has products.');
    }

    await this.categoryRepo.remove(category);
  }

  // async deactivate(id: number): Promise<CategoryResponseDto> {
  //   const category = await this.categoryRepo.findOne({ where: { id } });
  //
  //   if (!category) {
  //     throw new NotFoundException(`Category with ID ${id} not found`);
  //   }
  //
  //   category.isActive = false;
  //   const updatedCategory = await this.categoryRepo.save(category);
  //   return this.toCategoryResponseDto(updatedCategory);
  // }
  //
  // async activate(id: number): Promise<CategoryResponseDto> {
  //   const category = await this.categoryRepo.findOne({ where: { id } });
  //
  //   if (!category) {
  //     throw new NotFoundException(`Category with ID ${id} not found`);
  //   }
  //
  //   category.isActive = true;
  //   const updatedCategory = await this.categoryRepo.save(category);
  //   return this.toCategoryResponseDto(updatedCategory);
  // }

  async searchByName(name: string): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepo
      .createQueryBuilder('category')
      .where('category.name LIKE :name', { name: `%${name}%` })
      .leftJoinAndSelect('category.products', 'products')
      .getMany();

    return categories.map(category => this.toCategoryResponseDto(category));
  }
}