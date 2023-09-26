import { Sequelize } from 'sequelize';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB;
const dbUser = process.env.USER;
const dbPassword = process.env.PASS;

export const sequelize = new Sequelize(dbName!, dbUser!, dbPassword, {
  dialect: 'mysql',
  host: 'database',
});
export const redis = createClient({
  url: 'redis://redis:6379',
});