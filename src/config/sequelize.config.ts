import { Dialect, SequelizeOptions } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

interface Config {
	[key: string]: SequelizeOptions;
}

const config: Config = {
	development: {
		username: process.env.DB_USERNAME as string,
		password: process.env.DB_PASSWORD as string,
		database: process.env.DB_DEV_DATABASE as string,
		host: process.env.DB_HOST as string,
		port: parseInt(process.env.DB_PORT as string, 10),
		dialect: 'mysql' as Dialect,
	},
	test: {
		username: process.env.DB_USERNAME as string,
		password: process.env.DB_PASSWORD as string,
		database: process.env.DB_TEST_DATABASE as string,
		host: process.env.DB_HOST as string,
		dialect: 'mysql' as Dialect,
		logging: false,
	},
	production: {
		username: process.env.DB_USERNAME as string,
		password: process.env.DB_PASSWORD as string,
		database: process.env.DB_PROD_DATABASE as string,
		host: process.env.DB_HOST as string,
		dialect: 'mysql' as Dialect,
	},
};

export default config;
