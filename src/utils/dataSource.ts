import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptionsFactory = (): DataSourceOptions => {
  //dev env
  let env = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    synchronize: false,
    dropSchema: false,
    migrationsRun: true,
  };

  if (process.env.NODE_ENV === 'test') {
    env = {
      host: process.env.DB_HOST_TEST,
      port: parseInt(process.env.DB_PORT_TEST),
      username: process.env.DB_USERNAME_TEST,
      password: process.env.DB_PASSWORD_TEST,
      database: process.env.DB_TEST,
      dropSchema: true,
      synchronize: false,
      migrationsRun: true,
    };
  }
  return {
    type: 'postgres',
    host: env.host,
    port: env.port,
    username: env.username,
    password: env.password,
    database: env.database,
    entities: ['dist/typeOrm/entities/*{js,ts}'],
    migrations: ['dist/typeOrm/migrations/*{js,ts}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: env.migrationsRun,
    dropSchema: env.dropSchema,
    synchronize: env.synchronize,
  };
};

//to be used on migrations auto file generation - see package.json scripts for migrations
const dataSource = new DataSource(dataSourceOptionsFactory());

export default dataSource;
