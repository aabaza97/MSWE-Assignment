import joi from 'joi';

const userFromTokenSchema = joi.object({
	id: joi.number().empty('').required(),
	email: joi.string().email().empty('').required(),
	device_id: joi.string().empty('').required(),
});

export default userFromTokenSchema;
