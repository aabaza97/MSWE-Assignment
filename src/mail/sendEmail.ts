require('dotenv').config();
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

const fromName = 'ProvaAI';

const sendEmail = async (replacements: any, emailTo: string, configuration: any) => {
	try {
		// authroize transporter
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false, // Use `true` for port 465, `false` for all other ports
			auth: {
				user: process.env.MAIL_APP_USER,
				pass: process.env.MAIL_APP_PWD,
			},
		});

		// read the source file and compile it using handlebars
		const source = fs.readFileSync(configuration.source, 'utf-8').toString();
		const template = handlebars.compile(source);
		const htmlToSend = template(replacements);

		// wrap the email information
		const mailOptions = {
			from: `"${fromName}" <${process.env.MAIL_APP_USER}>`,
			to: emailTo,
			subject: configuration.subject,
			html: htmlToSend,
		};

		// send the email
		const result = await transporter.sendMail(mailOptions);

		// check if the email was sent successfully
		if (result.rejected.length > 0) {
			return {
				success: 'false',
				message: 'Email not sent',
				result,
			};
		}

		return {
			success: 'true',
			message: {
				sentTo: emailTo,
				messageId: result.messageId,
			},
		};
	} catch (error) {
		return error;
	}
};

export default sendEmail;
