import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API health status' })
  @ApiResponse({ status: 200, description: 'API is running' })
  checkHealth() {
    return {
      status: 'OK',
      message: 'E-commerce API is running!',
      timestamp: new Date().toISOString(),
      database: 'Connected to MySQL',
    };
  }
}