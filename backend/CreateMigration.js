const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { performance } = require('perf_hooks');
const logger = require('better-console-log-plus');

const createFileContent = (fileName, timestamp) => {
    return `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${fileName}${timestamp} implements MigrationInterface {
    name = '${fileName}${timestamp}'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query();
    }

};`;
};

function isValidFileName(fileName) {
    const forbiddenCharsRegex = /[ -._\/:\\]/;
    return !forbiddenCharsRegex.test(fileName);
}

const createMigration = () => {
    const argv = yargs
        .option('name', {
            alias: 'n',
            description: 'Migration name',
            type: 'string',
            demandOption: true,
        })
        .help()
        .alias('help', 'h');
    const fileName = argv.argv.name;
    if (fileName[0] !== fileName[0].toUpperCase()) {
        logger.error('Migration name must start with an uppercase letter');
        return;
    }
    if (!isValidFileName(fileName)) {
        logger.error('Migration name must not contain spaces, dashes, underscores, dots, slashes, or colons');
        return;
    }
    const timestamp = Date.now();
    const start = performance.now();
    const migrationPath = path.join(__dirname, './src/Migrations', `${timestamp}-${fileName}.ts`);
    fs.writeFileSync(migrationPath, createFileContent(fileName, timestamp));
    const end = performance.now();
    const elapsedTime = end - start;
    logger.info(`Migration created at ${migrationPath}`);
    logger.info(`Time taken: ${elapsedTime.toFixed(2)} milliseconds`);
};

createMigration();