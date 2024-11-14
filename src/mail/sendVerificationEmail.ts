import sendEmail from './sendEmail';
import EmailType from './emailType';

/**
 * @param {String} name - the name of the user (first name)
 * @param {String} emailTo - the email address of the recipient
 * @param {String} otp - the otp that will be sent to the user
 * @returns {Promise<Object>} - the result of the email sending operation
 * @description a wrapper function used to send an email of type email verification to a specific email address
 */

const sendVerificationEmail = async (name: string, emailTo: string, otp: string) => {
	const replacements = {
		fname: name,
		OTP: otp,
	};

	return await sendEmail(replacements, emailTo, EmailType.emailVerification);
};

export default sendVerificationEmail;
