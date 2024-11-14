import { Router } from 'express';

const router = Router();

// Auth Controllers
import { JWT as JWTManager, Google as GoogleManager } from '../../feature/auth/controller';

// Auth Middlewares
import * as AuthMW from '../../feature/auth/middleware';

/** POST /v1/auth/email/verify - Send verification email to user */
router.post('/emails/verify', JWTManager.sendVerificationEmail);

/** POST /v1/auth/register - Register a new user */
router.post('/register', JWTManager.register);
// router.get('/register/:token', AuthMW.verifyEmailVerificationToken, JWTAuthManager.register);

/** POST /v1/auth/login - Login a user */
router.post('/login', JWTManager.login);

/** POST /v1/auth/logout - Logout a user */
router.post('/logout', AuthMW.verifyAccessToken, JWTManager.logout);

/** POST /v1/auth/forgot-password - Send reset password email to user */
router.post('/forgot-password', JWTManager.forgotPassword);

/** POST /v1/auth/forgot-password/verify - Verify OTP to reset password */
router.post('/forgot-password/verify', JWTManager.verifyOTPToResetPassword);

/** POST /v1/auth/forgot-password/reset - Reset password */
router.post('/forgot-password/reset', AuthMW.verifyResetPasswordToken, JWTManager.resetPassword);

/** POST /v1/auth/token/refresh - Refresh access token */
router.post('/tokens/refresh', AuthMW.verifyRefreshToken, JWTManager.refreshAccessToken);

/** GET /v1/auth/google/access-request - Refresh access token */
router.get('/google/access-request', GoogleManager.getOAuthURL);

/** GET /v1/auth/google - Refresh access token */
router.get('/google', GoogleManager.handleOAuth);

module.exports = router;

export default router;
