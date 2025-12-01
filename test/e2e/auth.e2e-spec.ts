import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // These will be implemented when we add auth
  it('/auth/register (POST) - should register user', () => {
    // TODO: Implement when auth is ready
  });

  it('/auth/login (POST) - should login user', () => {
    // TODO: Implement when auth is ready
  });
});