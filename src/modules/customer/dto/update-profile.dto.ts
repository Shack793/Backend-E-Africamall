import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate, IsEnum } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John', description: 'First name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '1990-01-01', description: 'Date of birth', required: false })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiProperty({ example: 'Male', description: 'Gender', required: false })
  @IsOptional()
  @IsString()
  gender?: string;
}