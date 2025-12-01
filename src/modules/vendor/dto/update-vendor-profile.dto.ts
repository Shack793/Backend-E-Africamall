import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from './create-vendor.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVendorProfileDto extends PartialType(CreateVendorDto) {
  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  state?: string;

  @ApiProperty({ required: false })
  country?: string;

  @ApiProperty({ required: false })
  postalCode?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  logo?: string;

  @ApiProperty({ required: false })
  website?: string;
}