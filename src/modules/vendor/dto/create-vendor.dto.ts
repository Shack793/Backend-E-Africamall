import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsPhoneNumber, 
  IsUrl, 
  MinLength, 
  MaxLength,
  IsPostalCode,
  IsBoolean
} from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({
    description: 'Vendor business name',
    example: 'Tech Gadgets Inc.',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Vendor email address',
    example: 'contact@techgadgets.com'
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Vendor phone number',
    example: '+1234567890'
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Business address',
    example: '123 Main Street'
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'New York'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    description: 'State/Province',
    example: 'NY'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'USA'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({
    description: 'Postal/ZIP code',
    example: '10001'
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Business description',
    example: 'We sell the latest tech gadgets and electronics',
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Vendor logo URL',
    example: 'https://example.com/logo.png'
  })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Business website',
    example: 'https://techgadgets.com'
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'User ID if creating vendor for existing user',
    example: 'user-123'
  })
  @IsOptional()
  @IsString()
  userId?: string;
}