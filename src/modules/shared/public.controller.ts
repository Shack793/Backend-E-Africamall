import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('featured-products')
  async getFeaturedProducts() {
    return await this.publicService.getFeaturedProducts();
  }

  @Get('categories')
  async getAllCategories() {
    return await this.publicService.getAllCategories();
  }

  @Get('category/:id/products')
  async getProductsByCategory(@Param('id') id: number) {
    return await this.publicService.getProductsByCategory(id);
  }

  @Get('settings')
  async getBusinessSettings() {
    return await this.publicService.getBusinessSettings();
  }

  @Get('search')
  async searchProducts(@Query('q') query: string) {
    return await this.publicService.searchProducts(query);
  }
}
