import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateVendorStatusDto {
  @ApiProperty({ 
    description: 'Vendor approval status',
    example: true
  })
  @IsBoolean()
  isApproved: boolean;

  @ApiProperty({ 
    description: 'Approval notes or reason', 
    required: false,
    example: 'Vendor meets all requirements and has provided necessary documentation.'
  })
  @IsOptional()
  @IsString()
  approvalNotes?: string;
}