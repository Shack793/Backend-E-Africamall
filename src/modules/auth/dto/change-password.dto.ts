import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPassword123', description: 'Current password' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ 
    example: 'newPassword123', 
    description: 'New password', 
    minLength: 6 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ 
    example: 'newPassword123', 
    description: 'Confirm new password' 
  })
  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string;
}