import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: 'Electronic devices and accessories', 
    description: 'Category description',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: 'electronics.jpg', 
    description: 'Category image URL',
    required: false 
  })
  @IsOptional()
  @IsString()
  image?: string;

  // @ApiProperty({ 
  //   example: true, 
  //   description: 'Whether category is active',
  //   required: false,
  //   default: true 
  // })
  // @IsOptional()
  // @IsBoolean()
  // isActive?: boolean;
}