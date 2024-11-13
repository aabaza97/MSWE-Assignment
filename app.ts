import Express, { NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { CustomCorsOptions } from './src/config';
import { AppMiddleware } from './src/middleware';

// Load environment variables from .env file
dotenv.config();

// Create an express application
const app = Express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors(CustomCorsOptions));

// Parse URL-encoded request bodies
app.use(Express.urlencoded({ extended: true }));

// Parse JSON request bodies
app.post('*', Express.json());
app.put('*', Express.json());

// Use the responder middleware
app.use(AppMiddleware.responder);
app.use(AppMiddleware.invalidRouteHandler);
app.use(AppMiddleware.errorHandler);

export default app;
