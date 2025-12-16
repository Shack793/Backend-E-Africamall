import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password'),
  database: configService.get('database.database'),
  entities: [__dirname + '/../entities/*.entity.js'],

  synchronize: true,
  migrationsRun: true,
  migrations: [__dirname + '/../migrations/*.js'],

  logging: configService.get('app.environment') === 'development' ? ['error', 'warn'] : false,
});
