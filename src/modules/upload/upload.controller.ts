import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
  Delete,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import  JwtAuthGuard  from '../../common/guards/jwt-auth.guard';
import  RolesGuard  from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UploadService } from './upload.service';
import { UploadResponseDto } from './dto/upload-response.dto';
import { imageStorageConfig, documentStorageConfig } from '../../config/multer.config';
import type { File as MulterFile } from 'multer';

@ApiTags('Vendor Upload')
@Controller('vendor/upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('vendor')
@ApiBearerAuth()
export class UploadController {
  vendorsService: any;
  constructor(private readonly uploadService: UploadService) {}

  @Post('logo')
  @ApiOperation({ summary: 'Upload vendor logo' })
  @ApiResponse({ status: 201, description: 'Logo uploaded successfully', type: UploadResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Logo image file (jpg, jpeg, png, gif, webp) max 5MB',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', imageStorageConfig))
  async uploadLogo(
    @Request() req,
    @UploadedFile() file: MulterFile,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const vendorId = req.user.vendorId || req.user.id;
    const fileUrl = await this.uploadService.saveVendorLogo(vendorId, file.filename);

    return {
      url: fileUrl,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date(),
    };
  }

  @Post('products/:id/image')
  @ApiOperation({ summary: 'Upload product image' })
  @ApiResponse({ status: 201, description: 'Product image uploaded successfully', type: UploadResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Product image file (jpg, jpeg, png, gif, webp) max 5MB',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', imageStorageConfig))
  async uploadProductImage(
    @Request() req,
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFile() file: MulterFile,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const vendorId = req.user.vendorId || req.user.id;
    const fileUrl = await this.uploadService.saveProductImage(vendorId, productId, file.filename);

    return {
      url: fileUrl,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date(),
    };
  }

  @Post('documents')
  @ApiOperation({ summary: 'Upload vendor documents' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully', type: UploadResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file (pdf, doc, docx, txt) max 10MB',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', documentStorageConfig))
  async uploadDocument(
    @Request() req,
    @UploadedFile() file: MulterFile,
  ): Promise<UploadResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileUrl = `/uploads/vendors/${file.filename}`;

    return {
      url: fileUrl,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date(),
    };
  }

  @Delete('logo')
  @ApiOperation({ summary: 'Delete vendor logo' })
  @ApiResponse({ status: 200, description: 'Logo deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteLogo(@Request() req): Promise<{ message: string }> {
    const vendorId = req.user.vendorId || req.user.id;
    const vendor = await this.vendorsService.findOne(vendorId);

    if (vendor.logo) {
      await this.uploadService.deleteFile(vendor.logo);
      await this.vendorsService.update(vendorId, { logo: null });
    }

    return { message: 'Logo deleted successfully' };
  }

  @Get('logo')
  @ApiOperation({ summary: 'Get vendor logo URL' })
  @ApiResponse({ status: 200, description: 'Logo URL retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLogo(@Request() req): Promise<{ logoUrl: string | null }> {
    const vendorId = req.user.vendorId || req.user.id;
    const vendor = await this.vendorsService.findOne(vendorId);

    return { logoUrl: vendor.logo || null };
  }
}