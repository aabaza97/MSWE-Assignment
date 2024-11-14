import axios from 'axios';

interface GoogleUserInfo {
	id_token: string;
	access_token: string;
}

/**
 * A wrapper function used to get the google user info
 *
 * @param {Object} googleUserInfo - the google user info object
 * @param {String} googleUserInfo.id_token - the google user id token
 * @param {String} googleUserInfo.access_token - the google user access token
 * @returns {Promise<Object>} - the google user info
 */
const getGoogleUserInfo = async ({ id_token: idToken, access_token: accessToken }: GoogleUserInfo) => {
	const url = 'https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=';
	const result = await axios.get(url + accessToken, {
		headers: {
			Authorization: `Bearer ${idToken}`,
		},
	});

	return result.data;
};

export default getGoogleUserInfo;
