import dotenv from 'dotenv';
dotenv.config();
console.log('Environment:', process.env.NODE_ENV);

import app from './app';

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
