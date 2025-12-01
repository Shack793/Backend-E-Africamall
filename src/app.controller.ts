import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API Welcome' })
  @ApiResponse({ status: 200, description: 'Welcome message' })
  getHello() {
    return {
      message: 'E-commerce API Server is Running! ',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        docs: '/api-docs',
        health: '/health'
      }
    };
  }
}