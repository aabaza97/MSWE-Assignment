import joi from 'joi';

const sendVerificationEmailSchema = joi.object({
	email: joi.string().email().required(),
	password: joi.string().required(),
	first_name: joi.string().required(),
	last_name: joi.string().required(),
});

export default sendVerificationEmailSchema;
