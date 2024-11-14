import Queue from 'bull';
import * as Mailer from '../../../mail';

export const QUEUE_NAME = 'mail_queue';

const redisOptions = {
	host: process.env.REDIS_HOST || 'localhost',
	port: Number(process.env.REDIS_PORT || 6379),
};

const queue = new Queue(QUEUE_NAME, { redis: redisOptions });

queue.process(QUEUE_NAME, 2, async (job, done) => {
	try {
		const { ofType: mailType } = job.data;

		if (mailType === Mailer.EmailTypes.emailVerification) {
			const { email, firstName, otp } = job.data;
			await Mailer.sendVerificationEmail(firstName, email, otp);
			console.log(`Email sent successfully to ${email}`);
			done();
			return;
		}

		// if (mailType === Mailer.MailTypes.passwordReset) {
		// 	const { email, otp } = job.data;
		// 	await Mailer.sendPasswordResetEmail(email, otp);
		// 	console.log(`Password reset email sent successfully to ${email}`);
		// 	done();
		// 	return;
		// }
	} catch (error: Error | any) {
		done(error);
	}
});

/**
 * Queue emails
 * @param {typeof Mailer.MailTypes} ofType - the type of email to send
 * @param {Object} data - the data to send in the email
 * @returns {Promise<Queue.Job>} - the job created
 */
export default async function queueEmails(ofType: Mailer.EmailTypes, data: object): Promise<Queue.Job> {
	return await queue.add(QUEUE_NAME, { ofType, ...data });
}
