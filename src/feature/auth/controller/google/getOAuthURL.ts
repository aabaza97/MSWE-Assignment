import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';

/**
 * Generates a URL for OAuth 2.0 authorization with Google.
 *
 * This function constructs a URL that redirects the user to Google's OAuth 2.0 authorization endpoint.
 * Upon successful authorization, Google will redirect the user back to the application's redirect URI with an authorization code.
 *
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @param {Function} next - The Express.js middleware function to call next in the chain.
 * @returns {Promise} No explicit return value, but calls next() with either response object or error.
 *
 * @throws {Error} Any error encountered during URL generation.
 */
const getOAuthURL = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		// Base URL for Google OAuth 2.0 authorization endpoint
		const baseURL = 'https://accounts.google.com/o/oauth2/v2/auth';

		// Options for the authorization request
		const options = {
			redirect_uri: process.env.GOOGLE_OAUTH_REDIR_URI || '',
			client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
			response_type: 'code',
			access_type: 'offline',
			prompt: 'consent',
			scope: [
				'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/userinfo.email',
			].join(' '),
		} satisfies { [key: string]: string };

		// Build URL search parameters object
		const searchParams = new URLSearchParams(options);

		// Construct the complete OAuth URL
		const url = `${baseURL}?${searchParams.toString()}`;

		// Prepare successful response object & Respond
		req.response = {
			status: 200,
			message: 'msg_access_request_success',
			data: {
				url,
			},
		};

		return next();
	} catch (error) {
		// if (!error.status) return next(errors.InternalServerError('msg_unknown_error'));
		return next(error);
	}
};

export default getOAuthURL;
