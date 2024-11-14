import path from 'path';

/**
 * @description Enum for email types.
 */
enum EmailTypes {
	emailVerification = 'emailVerification',
	passwordReset = 'passwordReset',
}

/**
 * @description this object is used as a reference of email types and their corresponding subject and source files.
 */
const Emails = {
	[EmailTypes.emailVerification]: {
		subject: 'App | Verify Email',
		source: path.join(__dirname, './view/template.html'),
	},
	[EmailTypes.passwordReset]: {
		subject: 'App | Account Reset',
		source: path.join(__dirname, './view/template.html'),
	},
};

export { EmailTypes };
export default Emails;
