import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { VendorsService } from '../vendor/vendor.service'; 

@Injectable()
export class UploadService {
  constructor(private readonly vendorsService: VendorsService) {}

  async saveVendorLogo(vendorId: string, filename: string): Promise<string> {
    try {
      const vendor = await this.vendorsService.findOne(vendorId);
      if (!vendor) {
        throw new BadRequestException('Vendor not found');
      }

      if (vendor.logo) {
        await this.deleteFile(vendor.logo);
      }

      const logoUrl = `/uploads/vendors/${filename}`;
      await this.vendorsService.update(vendorId, { logo: logoUrl });

      return logoUrl;
    } catch (error) {
      throw new InternalServerErrorException('Failed to save vendor logo');
    }
  }

  async saveProductImage(vendorId: string, productId: number, filename: string): Promise<string> {
    try {
      const product = await this.vendorsService.getVendorProductById(vendorId, productId);
      if (!product) {
        throw new BadRequestException('Product not found');
      }

      if (product.image) {
        await this.deleteFile(product.image);
      }

      const imageUrl = `/uploads/vendors/${filename}`;
      const updateProductDto = {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: imageUrl,
      };
      await this.vendorsService.updateVendorProduct(vendorId, productId, updateProductDto);

      return imageUrl;
    } catch (error) {
      throw new InternalServerErrorException('Failed to save product image');
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = join(process.cwd(), 'uploads', 'vendors', filePath.split('/').pop() || '');
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  async validateFileExists(filename: string): Promise<boolean> {
    try {
      const fullPath = join(process.cwd(), 'uploads/vendors', filename);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}