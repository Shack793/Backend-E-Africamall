import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from './dto';
import JwtAuthGuard from '../../common/guards/jwt-auth.guard';
import RolesGuard from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully', type: [CategoryResponseDto] })
  async findAll(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories (including inactive) - Admin only' })
  @ApiResponse({ status: 200, description: 'All categories retrieved successfully', type: [CategoryResponseDto] })
  async findAllWithProducts(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAllWithProducts();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search categories by name' })
  @ApiQuery({ name: 'name', type: String, description: 'Category name to search for' })
  @ApiResponse({ status: 200, description: 'Categories found successfully', type: [CategoryResponseDto] })
  async searchByName(@Query('name') name: string): Promise<CategoryResponseDto[]> {
    return this.categoriesService.searchByName(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully', type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: number): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category - Admin only' })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: CategoryResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category - Admin only' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists' })
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category - Admin only' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete category with products' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }

  @Put(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a category - Admin only' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category deactivated successfully', type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async deactivate(@Param('id') id: number): Promise<CategoryResponseDto> {
    return this.categoriesService.deactivate(id);
  }

  @Put(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a category - Admin only' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category activated successfully', type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async activate(@Param('id') id: number): Promise<CategoryResponseDto> {
    return this.categoriesService.activate(id);
  }
}