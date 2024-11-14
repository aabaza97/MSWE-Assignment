export enum CachePolicy {
	EmailVerification = 60 * 60, // 1 hour
	ForgotPassword = 5 * 60, // 5 minutes
}

// Enum for the available cache keys
export enum CacheKey {
	EmailVerification = 've',
	TokenForUserDevice = 'tfu',
	PasswordReset = 'pr',
}

export interface UserCacheData {
	id?: number;
	email: string;
	first_name: string;
	last_name: string;
	hash: string;
	provider_id?: string;
	provider?: string;
	otp?: string | number;
}
