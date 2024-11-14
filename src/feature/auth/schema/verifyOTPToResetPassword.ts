import joi from 'joi';

const verifyOTPToResetPasswordSchema = joi.object({
	email: joi.string().email().empty('').required(),
	otp: joi.string().empty('').required().length(6),
});

export default verifyOTPToResetPasswordSchema;
