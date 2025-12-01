import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'Password for the account' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    example: 'customer', 
    description: 'User role',
    enum: ['admin', 'vendor', 'customer'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['admin', 'vendor', 'customer'])
  role?: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number (required for customer/vendor)', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'John', description: 'First name (for customer)', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name (for customer)', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'My Business Inc.', description: 'Business name (for vendor)', required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ example: 'We provide quality products...', description: 'Business description (for vendor)', required: false })
  @IsOptional()
  @IsString()
  businessDescription?: string;

  @ApiProperty({ example: '123 Main Street', description: 'Address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'New York', description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'NY', description: 'State/Province', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 'USA', description: 'Country', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: '10001', description: 'Postal code', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;
}