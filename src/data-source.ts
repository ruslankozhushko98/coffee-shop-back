import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { OTC, Token, User } from './auth/entities';
import { Beverage } from './menu/entities';
import { BeveragesOnOrders, Order } from './orders/entities';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, OTC, Token, Beverage, BeveragesOnOrders, Order],
  migrations: ['dist/migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: true,
});
