import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ description: 'File URL' })
  url: string;

  @ApiProperty({ description: 'File name' })
  filename: string;

  @ApiProperty({ description: 'Original file name' })
  originalname: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'File mimetype' })
  mimetype: string;

  @ApiProperty({ description: 'Upload timestamp' })
  uploadedAt: Date;
}