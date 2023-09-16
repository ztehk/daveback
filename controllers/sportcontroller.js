const { google } = require('googleapis');
const cloudinary = require('../utils/cloudinary');

const mongoose = require('mongoose');
const Sport = require('../models/sportmodel');

const getAllSport = async (req, res) => {
	const sport = await Sport.find({}).sort({ createdAt: -1 });
	res.status(200).json(sport);
};

const getOneSport = async (req, res) => {
	const { title } = req.params;
	const regex = new RegExp(title, 'i');
	const sport = await Sport.findOne({ slug: regex }).populate(
		'comments.postedBy',
		'email'
	);

	if (!sport) {
		return res.status(404).json({ error: 'No such sport!' });
	}
	res.status(200).json(sport);
};
const postSingleSport = async (req, res) => {
	let photo;
	let uploadedVideo;
	let result;
	const {
		title,
		body,
		author,
		video,
		metaKey,
		metaDescription,
		image,
		slug,
		categ,
	} = req.body;

	try {
		// Authenticate with Google Drive
		if (video) {
			try {
				uploadedVideo = await cloudinary.uploader.upload(video, {
					timeout: 240000,
					resource_type: 'video',
					public_id: `${title}`,
					folder: 'video',
				});
			} catch (error) {
				console.log(error);
				return res
					.status(401)
					.json({ error: 'Failed to upload video' });
			}

			if (!uploadedVideo) {
				return res
					.status(401)
					.json({ error: 'Failed to upload video' });
			}
			// try {
			// 	const SCOPES = ['https://www.googleapis.com/auth/drive'];
			// 	const auth = new google.auth.GoogleAuth({
			// 		credentials: require('../credentials.json'), // Load your credentials
			// 		scopes: SCOPES,
			// 	});

			// 	const drive = google.drive({ version: 'v3', auth });

			// 	// Upload video to Google Drive
			// 	const fileMetadata = {
			// 		name: `${title}.MP4`, // Adjust the name of the file
			// 		parents: ['1GSJZKyeVOnRpQyZM1LrvNuSavpOrhBZQ'],
			// 	};

			// 	const media = {
			// 		mimeType: 'video/mp4', // Adjust the MIME type if necessary
			// 		body: video, // Assuming you're sending the video as a URL or base64 data
			// 	};

			// 	uploadedFile = await drive.files.create({
			// 		resource: fileMetadata,
			// 		media: media,
			// 		fields: 'id',
			// 	});
			// 	try {
			// 		const fieldId = uploadedFile.data.id;
			// 		await drive.permissions.create({
			// 			fileId: fieldId,
			// 			requestBody: {
			// 				role: 'reader',
			// 				type: 'anyone',
			// 			},
			// 		});
			// 		result = await drive.files.get({
			// 			fileId: fieldId,
			// 			fields: 'webViewLink',
			// 		});
			// 		console.log(result.data.webViewLink);
			// 	} catch (error) {
			// 		console.log(error);
			// 	}
			// } catch (error) {
			// 	console.log(error);
			// }
		}

		// Now, uploadedFile.data.id contains the Google Drive file ID

		// Create a new News entry in your MongoDB with the uploadedFile.data.id

		try {
			photo = await cloudinary.uploader.upload(image, {
				folder: 'images',
				width: 'auto',
				crop: 'fit',
				use_filename: true,
			});
		} catch (error) {
			return res.status(401).json({ error: 'Failed to upload image' });
		}

		if (!photo) {
			return res.status(401).json({ error: 'Failed to upload image' });
		}

		// console.log(photo.secure_url);
		let trimslug = slug.trim().replace(/\s+/g, '-');
		if (video) {
			const sport = await Sport.create({
				title,
				body,
				author,
				metaKey,
				metaDescription,
				slug: trimslug,
				categ,
				image: {
					public_id: photo.public_id,
					url: photo.secure_url,
				},
				video: {
					public_id: uploadedVideo.public_id,
					url: uploadedVideo.secure_url,
				},
			});
			res.status(200).json(sport);
		} else {
			const sport = await Sport.create({
				title,
				body,
				author,
				metaKey,
				metaDescription,
				slug: trimslug,
				categ,
				image: {
					public_id: photo.public_id,
					url: photo.secure_url,
				},
			});
			res.status(200).json(Sport);
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const deleteOneSport = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such sport!' });
	}
	const lyricsid = await Sport.findByIdAndDelete({ _id: id });
	if (!lyricsid) {
		return res.status(404).json({ error: 'No such sport' });
	}
	const sport = await Sport.find({}).sort({ createdAt: -1 });
	res.status(200).json(sport);
};

const addComent = async (req, res, next) => {
	const { comment, username } = req.body;
	try {
		const sport = await Sport.findByIdAndUpdate(
			req.params.id,
			{
				$push: {
					comments: {
						text: comment,
						postedBy: username,
					},
				},
			},
			{ new: true }
		);
		res.status(200).json({
			success: true,
			sport,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};
module.exports = {
	postSingleSport,
	getAllSport,
	getOneSport,
	deleteOneSport,
	addComent,
};
