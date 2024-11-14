import joi from 'joi';

const registerSchema = joi.object({
	email: joi.string().email().required(),
	otp: joi.string().required().length(6),
});

export default registerSchema;
