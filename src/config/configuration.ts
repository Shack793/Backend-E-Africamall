export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'ecommerce_db',
  },
  app: {
    port: parseInt(process.env.PORT ?? '3000', 10),
    environment: process.env.NODE_ENV || 'development',
  },
});