import joi from 'joi';

const forgotPasswordSchema = joi.object({
	email: joi.string().email().empty('').required(),
});

export default forgotPasswordSchema;
