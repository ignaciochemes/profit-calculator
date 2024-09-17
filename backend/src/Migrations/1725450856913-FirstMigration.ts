import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1725450856913 implements MigrationInterface {
    name = 'FirstMigration1725450856913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`history_profit\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_b68f74bc88402d6f571f3f483b\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 0, \`is_delete\` tinyint NOT NULL DEFAULT 0, \`cost\` decimal(10,2) NULL DEFAULT '0.00', \`cost_usd\` decimal(10,2) NULL DEFAULT '0.00', \`selling_price\` decimal(10,2) NULL DEFAULT '0.00', \`selling_price_usd\` decimal(10,2) NULL DEFAULT '0.00', UNIQUE INDEX \`IDX_1442fd7cb5e0b32ff5d0b6c13d\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`profit_history_product\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NULL DEFAULT '0', \`historyProfitId\` int NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`profit_history_product\` ADD CONSTRAINT \`FK_263b36a95693c57a8bf726bc64b\` FOREIGN KEY (\`historyProfitId\`) REFERENCES \`history_profit\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`profit_history_product\` ADD CONSTRAINT \`FK_6e5e9531ebdc65bcffc84decca6\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profit_history_product\` DROP FOREIGN KEY \`FK_6e5e9531ebdc65bcffc84decca6\``);
        await queryRunner.query(`ALTER TABLE \`profit_history_product\` DROP FOREIGN KEY \`FK_263b36a95693c57a8bf726bc64b\``);
        await queryRunner.query(`DROP TABLE \`profit_history_product\``);
        await queryRunner.query(`DROP INDEX \`IDX_1442fd7cb5e0b32ff5d0b6c13d\` ON \`product\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP INDEX \`IDX_b68f74bc88402d6f571f3f483b\` ON \`history_profit\``);
        await queryRunner.query(`DROP TABLE \`history_profit\``);
        await queryRunner.query(`DROP INDEX \`IDX_ae4578dcaed5adff96595e6166\` ON \`role\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
