import sendVerificationEmailSchema from './sendVerificationEmail';
import registerSchema from './register';
import loginSchema from './login';
import tokenSchema from './token';
import logoutSchema from './logout';
import userFromTokenSchema from './userFromToken';
import forgotPasswordSchema from './forgotPassword';
import verifyOTPToResetPasswordSchema from './verifyOTPToResetPassword';
import resetPaswordSchema from './resetPasword';

import { validate } from '../../../util/helper';

export const validateSendVerificationEmail = validate(sendVerificationEmailSchema);
export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateToken = validate(tokenSchema);
export const validateLogout = validate(logoutSchema);
export const validateUserFromToken = validate(userFromTokenSchema);
export const validateForgotPassword = validate(forgotPasswordSchema);
export const validateVerifyOTPToResetPassword = validate(verifyOTPToResetPasswordSchema);
export const validateResetPassword = validate(resetPaswordSchema);
