import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrencyMigration1727449776149 implements MigrationInterface {
    name = 'AddCurrencyMigration1727449776149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`exchange_rate\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`currency\` varchar(3) NOT NULL, \`rate\` decimal(10,4) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`exchange_rate\` ADD CONSTRAINT \`FK_701ad7f8b0187be5a4e36d6639b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exchange_rate\` DROP FOREIGN KEY \`FK_701ad7f8b0187be5a4e36d6639b\``);
        await queryRunner.query(`DROP TABLE \`exchange_rate\``);
    }

}
