import { Request, Response, NextFunction, Error } from 'express';
import errors from 'http-errors';

/**
 * Handles invalid routes by sending a 404 Not Found error response.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next function to pass control to subsequent middleware.
 */
const invalidRouteHandler = (req: Request, res: Response, next: NextFunction) => {
	next(errors.NotFound('msg_invalid_route'));
};

export default invalidRouteHandler;
