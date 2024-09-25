import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envFile = process.argv[2] || '.env';
const envPath = path.resolve(process.cwd(), envFile);

if (!fs.existsSync(envPath)) {
  console.error(`El archivo ${envFile} no existe.`);
  process.exit(1);
}

const envConfig = dotenv.config({ path: envPath });
Object.assign(process.env, envConfig.parsed);