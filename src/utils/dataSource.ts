import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptionsFactory = (): DataSourceOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    entities: ['dist/typeOrm/entities/*.js'],
    // synchronize: process.env.DB_SYNC === 'true',
    migrations: ['dist/typeOrm/migrations/*.js'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: false,
  };
};

const dataSource = new DataSource(dataSourceOptionsFactory());

export default dataSource;
