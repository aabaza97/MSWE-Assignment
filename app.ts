import Express from 'express';
import cors from 'cors';

import { CustomCorsOptions } from './src/config';
import { AppMiddleware } from './src/middleware';
import AppRouter from './src/route';

// Create an express application
const app = Express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors(CustomCorsOptions));

// Parse URL-encoded request bodies
app.use(Express.urlencoded({ extended: true }));

// Parse JSON request bodies
app.post('*', Express.json());
app.put('*', Express.json());

app.use((req, res, next) => {
	console.log('––––––––––––––––– REQUEST –––––––––––––––––');
	console.log('Request:', req.method, req.path, '\n');
	console.log('Headers:', req.headers);
	console.log('Body:', req.body);
	console.log('Query:', req.query);
	console.log('Params:', req.params);
	console.log('––––––––––––––––– End of Request –––––––––––––––––');
	next();
});

// Use the main app router
app.use('/api', AppRouter);

// Use the responder middleware
app.use(AppMiddleware.responder);
app.use(AppMiddleware.invalidRouteHandler);
app.use(AppMiddleware.errorHandler);

export default app;
