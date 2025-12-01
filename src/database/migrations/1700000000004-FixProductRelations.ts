import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixProductRelations1700000000004 implements MigrationInterface {
  name = 'FixProductRelations1700000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_variations\`;`);

    await queryRunner.query(`DROP TABLE IF EXISTS \`products\`;`);

    await queryRunner.query(`
      CREATE TABLE \`products\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`description\` text NOT NULL,
        \`price\` decimal(10,2) NOT NULL,
        \`image\` varchar(255) NULL,
        \`stock\` int NOT NULL DEFAULT 0,
        \`isFeatured\` tinyint(1) NOT NULL DEFAULT 0,
        \`categoryId\` int NULL,
        \`vendorId\` int NULL,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE \`product_variations\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`price\` decimal(10,2) NOT NULL,
        \`stock\` int NOT NULL DEFAULT 0,
        \`productId\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_product_variation_product\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      ALTER TABLE \`products\`
      ADD CONSTRAINT \`FK_products_category\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE \`products\`
      ADD CONSTRAINT \`FK_products_vendor\` FOREIGN KEY (\`vendorId\`) REFERENCES \`vendors\`(\`id\`) ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_products_vendor\`;`);
    await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_products_category\`;`);
    await queryRunner.query(`DROP TABLE \`product_variations\`;`);
    await queryRunner.query(`DROP TABLE \`products\`;`);
  }
}
