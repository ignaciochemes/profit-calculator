import { DataSource } from 'typeorm';

import * as Dotenv from 'dotenv';
import * as path from 'path';
import * as logger from 'better-console-log-plus';
import { envModelTransformer } from './src/Configs/NestEnvConfig';
import { envFilePathConfiguration } from './src/Configs/EnvFilePathConfig';

let envs;

if (process.env.PROFIT_CALCULATOR_ENV === 'local') {
    const envData = Dotenv.config({
        path: `${path.join(process.env.PWD)}/${envFilePathConfiguration()}`,
    }).parsed;
    logger.info(`TYPEORM ENVIRONMENT: ${process.env.PROFIT_CALCULATOR_ENV}\nDATABASE CONNECTION: ${process.env.DATABASE_HOST}`);
    envs = envModelTransformer(envData);
} else {
    logger.info(`TYPEORM ENVIRONMENT: ${process.env.PROFIT_CALCULATOR_ENV}\nDATABASE CONNECTION: ${process.env.DATABASE_HOST}`);
    envs = envModelTransformer(process.env);
}

export const connectionSource = new DataSource({
    migrationsTableName: 'migrations',
    type: envs.DATABASE.type,
    host: envs.DATABASE.host,
    port: envs.DATABASE.port,
    username: envs.DATABASE.username,
    password: envs.DATABASE.password,
    database: envs.DATABASE.database,
    logging: false,
    synchronize: envs.DATABASE.synchronize,
    migrations: ['src/Migrations/**/*.{ts,js}'],
    entities: ['src/Models/Entities/**/*.{ts,js}'],
});

connectionSource
    .initialize()
    .then(() => logger.info('Connection to database established'))
    .catch((error) => logger.error('TypeORM connection error: ', error));