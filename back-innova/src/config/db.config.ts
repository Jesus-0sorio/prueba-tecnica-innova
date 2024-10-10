import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DBConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'innove-test',
  autoLoadEntities: true,
  synchronize: true,
};
