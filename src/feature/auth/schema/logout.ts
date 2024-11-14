import joi from 'joi';

const logoutSchema = joi.object({
	id: joi.number().empty('').required(),
	device_id: joi.string().empty('').required(),
	email: joi.string().empty('').required(),
});

export default logoutSchema;
