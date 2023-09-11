const { google } = require('googleapis');
const drive = google.drive('v3');

const credentials = require('../credentials.json');

async function getFileContent(fileId) {
	const auth = new google.auth.GoogleAuth({
		credentials,
		scopes: ['https://www.googleapis.com/auth/drive.readonly'],
	});

	const client = await auth.getClient();
	const response = await drive.files.get(
		{
			fileId: fileId,
			alt: 'media',
		},
		{ auth: client }
	);
	return response.data;
}

module.exports = { getFileContent };
