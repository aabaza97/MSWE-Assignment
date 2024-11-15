import path from 'path';
import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import { generateAuthTokens, getGoogleOAuthToken, getGoogleUserInfo } from '../../helper';
import { User } from '../../../../db/repository';

const handleOAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { code } = req.query;

		// Get OAuth token with code
		if (typeof code !== 'string') {
			throw errors.BadRequest('Invalid OAuth code');
		}

		const data = await getGoogleOAuthToken(code);

		// Get user info with token
		const userInfo = await getGoogleUserInfo(data);

		// Check if user email is verified
		if (!userInfo.email_verified) throw errors.Forbidden('msg_unverified_google_acc');

		// Do the DB work (update existing / insert new )
		const user = {
			provider: 'google',
			provider_id: userInfo.sub,
			email: userInfo.email,
			first_name: userInfo.given_name,
			last_name: userInfo.family_name,
			hash: '',
		} satisfies User.NewDBUser;

		let [dbUser, created] = await User.upsert(user);

		// Update user info if not created and no provider info
		if (!created && !dbUser.provider && !dbUser.provider_id) {
			// Update user info
			dbUser = await User.updateOAuthProvider(dbUser.id, user);
		}

		// Get access & refresh token (login)
		const tokens = await generateAuthTokens(dbUser);

		// Send response
		// return res.render('OAuthSuccess', { user: dbUser, tokens }, (err, html) => {
		// 	if (err) throw err;
		// 	res.send(html);
		// });
		return res.sendFile(path.join(__dirname, '../../../../../../public/view/oAuthSucess.html'));
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export default handleOAuth;
