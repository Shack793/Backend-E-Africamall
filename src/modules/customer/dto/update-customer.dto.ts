import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer full name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'john@example.com', description: 'Customer email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+1234567890', description: 'Customer phone number', required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}