import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Customer email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Customer phone number', required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}