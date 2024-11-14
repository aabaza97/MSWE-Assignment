import { Request } from 'express';
import Joi from 'joi';

/**
 * Creates a validation function for a given schema.
 *
 * @param {Object} schema - The validation schema against which to validate payloads.
 * @return {Function} - A function that accepts a payload and validates it against the schema.
 */
const validate =
	(schema: Joi.Schema): Function =>
	(payload: Request['body']) =>
		/**
		 * Validates the given payload against the provided schema.
		 *
		 * @param {Object} payload - The payload to validate.
		 * @throws {ValidationError} - If the payload does not conform to the schema.
		 */
		schema.validate(payload, { abortEarly: false });

export default validate;
