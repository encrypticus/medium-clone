import { DataSourceOptions, DataSource } from 'typeorm';

export const config: DataSourceOptions = {
  migrationsTableName: 'migrations',
  database: 'medium_clone',
  host: 'postgres',
  port: 5432,
  username: 'medium_clone',
  password: '123',
  type: 'postgres',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

const postgresDataSource = new DataSource(config);

postgresDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default postgresDataSource;
