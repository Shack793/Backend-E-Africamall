import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({ example: 1, description: 'Customer ID' })
  id: number; 

  @ApiProperty({ example: 'John Doe', description: 'Customer full name' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Customer email address' })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Customer phone number', required: false })
  phone?: string;

  @ApiProperty({ example: '123 Main St, City, State', description: 'Customer address', required: false })
  address?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'uuid-here', description: 'User ID reference', required: false })
  userId?: string;
}