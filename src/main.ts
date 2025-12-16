import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { networkInterfaces } from 'os';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';


function getLocalIP(): string {
  const interfaces = networkInterfaces();
  
  for (const interfaceName of Object.keys(interfaces)) {
    const nets = interfaces[interfaceName];
    if (!nets) continue;
    for (const net of nets) {
      if (net.family === 'IPv4' && !net.internal) {
        if (net.address.startsWith('192.168.') || 
            net.address.startsWith('10.0.') ||
            net.address.startsWith('172.')) {
          return net.address;
        }
      }
    }
  }
  return 'localhost';
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation for e-commerce platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Products')
    .addTag('Admin')
    .addTag('Categories')
    .addTag('Customer')
    .addTag('Orders')
    .addTag('Payments')
    .addTag('Vendor')
    .addTag('Health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 5000;
  const localIP = getLocalIP();
  
  await app.listen(port, '0.0.0.0');

  console.log(`E-commerce API Server Running`);
  console.log(`Local: http://localhost:${port}`);
  console.log(`Network: http://${localIP}:${port}`);
  console.log(`API Docs: http://${localIP}:${port}/api-docs`);
  console.log(`Health: http://${localIP}:${port}/health`);
  console.log(`phpMyAdmin: http://localhost:8080`);
  console.log(`Database: mysql://localhost:3306/ecommerce_db`);
  console.log(``);
  console.log(`server url on local network:`);
  console.log(`   http://${localIP}:${port}`);
}

bootstrap();