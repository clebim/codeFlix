import env from 'dotenv';
import path from 'path';
import { DataSource } from 'typeorm';

env.config({ path: path.resolve(`./env/.env.${process.env.NODE_ENV}`) });

export const datasource = new DataSource({
  type: 'postgres',
  host: process.env.HTTP_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  migrationsRun: true,
  logging: process.env.DATABASE_LOGGING === 'true',
  entities: [`${__dirname}/schemas/*{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
});
