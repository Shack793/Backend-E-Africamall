import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
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

  describe('API endpoints', () => {
    it('/ (GET) - should return welcome message', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBeDefined();
          
        });
    });

    it('/health (GET) - should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('OK');
          expect(res.body.database).toBeDefined();
        });
    });

    it('/health (GET) - database should be connected', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.database).toMatch(/Connected/);
        });
    });

    it('/nonexistent-route (GET) - should return 404', () => {
      return request(app.getHttpServer())
        .get('/nonexistent-route')
        .expect(404);
    });
  });
});