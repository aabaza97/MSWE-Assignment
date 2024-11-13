import { CorsOptions } from 'cors';
import errors from 'http-errors';

const whitelist = ['http://127.0.0.1:3000', 'http://localhost:3000']; // TODO: Add Domains

// Custom origin function to allow CORS
const customOrigin = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
	if (whitelist.indexOf(origin || '') !== -1 || !origin) {
		callback(null, true);
	} else {
		callback(errors.Forbidden('Not allowed by CORS'));
	}
};

/**
 * Custom CORS options to allow only specific domains.
 *
 * @type {CorsOptions}
 */
const CustomCorsOptions: CorsOptions = {
	origin: customOrigin,
	optionsSuccessStatus: 200,
};

export default CustomCorsOptions;
