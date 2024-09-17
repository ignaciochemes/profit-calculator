import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductUserMigration1725636456907 implements MigrationInterface {
    name = 'ProductUserMigration1725636456907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_3e59a34134d840e83c2010fac9a\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_3e59a34134d840e83c2010fac9a\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`user_id\``);
    }

}
