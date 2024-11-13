import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

module.exports = {
	development: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DEV_DATABASE,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'mysql',
	},
	test: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_TEST_DATABASE,
		host: process.env.DB_HOST,
		dialect: 'mysql',
		logging: false,
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_PROD_DATABASE,
		host: process.env.DB_HOST,
		dialect: 'mysql',
	},
};
