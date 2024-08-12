import { config } from './ormconfig';
import { DataSource, DataSourceOptions } from 'typeorm';

const seedConfig: DataSourceOptions = {
  ...config,
  migrations: [__dirname + '/seeds/**/*{.ts,.js}'],
};

const postgresSeedDataSource = new DataSource(seedConfig);

postgresSeedDataSource
  .initialize()
  .then(() => {
    console.log('Seed Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Seed Data Source initialization', err);
  });

export default postgresSeedDataSource;
