import { Request, Response, NextFunction, Error } from 'express';
import errors from 'http-errors';

/**
 * Handles errors that occur during API requests and sends appropriate error responses.
 * @param {Error} err The error object representing the error to be handled.
 * @param {import('express').Request} req The Express request object.
 * @param {import('express').Response} res The Express response object.
 * @param {import('express').NextFunction} next The Express next function.
 * @returns {void} Does not return anything directly.
 */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	// If the response has already been sent, do nothing
	if (res.headersSent) {
		next(err);
		return;
	}

	console.dir(err);

	let error = err;
	if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')
		error = errors.Unauthorized('msg_invalid_token');
	else if (!err.status) error = errors.InternalServerError('msg_unknown_error');

	// Send the error message
	res.status(error.status || 500).json({
		error: {
			status: error.status,
			message: error.message,
		},
	});
	return;
};

export default errorHandler;
