const express = require('express');
const router = express.Router();
const { getFileContent } = require('../controllers/newsvideocont');

router.get('/:fileId', async (req, res) => {
	try {
		const fileId = req.params.fileId;
		const content = await getFileContent(fileId);

		res.setHeader('Content-Type', 'video/mp4'); // Set the correct content type for video
		res.send(content);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).send('Error fetching file content');
	}
});

module.exports = router;
