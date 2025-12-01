import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation for the e-commerce platform')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Products')
    .addTag('Admin')
    .addTag('Categories')
    .addTag('Customer')
    .addTag('Orders')
    .addTag('Payments')
    .addTag('Vendor')
    .addBearerAuth() 
    .build();
};
