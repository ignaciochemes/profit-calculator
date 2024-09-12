import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfitHistoryUserMigration1725635594897 implements MigrationInterface {
    name = 'ProfitHistoryUserMigration1725635594897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profit_history_product\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`profit_history_product\` ADD CONSTRAINT \`FK_1ebc30e90ff71127df8efb1d075\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profit_history_product\` DROP FOREIGN KEY \`FK_1ebc30e90ff71127df8efb1d075\``);
        await queryRunner.query(`ALTER TABLE \`profit_history_product\` DROP COLUMN \`user_id\``);
    }

}
