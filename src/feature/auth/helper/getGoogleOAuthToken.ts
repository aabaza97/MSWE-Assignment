import axios from 'axios';

interface GoogleOAuthTokenOptions {
	[key: string]: string;
}

const getGoogleOAuthToken = async (code: string) => {
	const url = 'https://oauth2.googleapis.com/token';

	const options = {
		code,
		client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
		client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
		redirect_uri: process.env.GOOGLE_OAUTH_REDIR_URI || '',
		grant_type: 'authorization_code',
	} satisfies GoogleOAuthTokenOptions;

	const params = new URLSearchParams(options);

	const res = await axios.post(url, params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

	return res.data;
};

export default getGoogleOAuthToken;
