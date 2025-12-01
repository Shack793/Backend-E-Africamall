import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsAndVariations1762912000000 implements MigrationInterface {
    name = 'CreateProductsAndVariations1762912000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('Creating products table with correct foreign key types...');
        

        await queryRunner.query('DROP TABLE IF EXISTS `product_variations`');
        await queryRunner.query('DROP TABLE IF EXISTS `products`');

        // Created products table with correct types:
        // - vendorId: varchar(36) to match vendors.id (UUID)
        // - categoryId: int to match categories.id (INT)
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
                \`vendorId\` varchar(36) NULL,
                \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
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
            ) ENGINE=InnoDB
        `);

        console.log('Tables created successfully!');
        
        try {
            await queryRunner.query(`
                ALTER TABLE \`products\`
                ADD CONSTRAINT \`FK_products_category\` 
                FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL
            `);
            console.log('Added category foreign key (int -> int)');
        } catch (error) {
            console.log('Error adding category foreign key:', error.message);
        }

        try {
            await queryRunner.query(`
                ALTER TABLE \`products\`
                ADD CONSTRAINT \`FK_products_vendor\` 
                FOREIGN KEY (\`vendorId\`) REFERENCES \`vendors\`(\`id\`) ON DELETE SET NULL
            `);
            console.log('Added vendor foreign key (varchar -> varchar)');
        } catch (error) {
            console.log('Error adding vendor foreign key:', error.message);
        }

        console.log('Migration completed successfully!');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS `product_variations`');
        await queryRunner.query('DROP TABLE IF EXISTS `products`');
    }
}