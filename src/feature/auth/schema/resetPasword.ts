import joi from 'joi';

const resetPaswordSchema = joi.object({
	password: joi.string().empty('').required().messages({ 'any.required': 'Password is required' }),
});

export default resetPaswordSchema;
