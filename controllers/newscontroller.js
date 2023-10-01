const { google } = require('googleapis');
const cloudinary = require('../utils/cloudinary');

const mongoose = require('mongoose');
const News = require('../models/newsmodel');

async function updateNews() {
	try {
		const currentDate = new Date();
		await News.updateMany({}, { $set: { updatedAt: currentDate } });
	} catch (error) {
		console.error('Error updating updatedAt:', error);
	}
}

const getAllNews = async (req, res) => {
	const news = await News.find({}).sort({ createdAt: -1 });
	res.status(200).json(news);
};

const getOneNews = async (req, res) => {
	const { title } = req.params;
	const regex = new RegExp(title, 'i');
	const news = await News.findOne({ slug: regex }).populate(
		'comments.postedBy',
		'email'
	);

	if (!news) {
		return res.status(404).json({ error: 'No such news!' });
	}
	res.status(200).json(news);
};
const postSinglenews = async (req, res) => {
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
		}

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
			const news = await News.create({
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
			res.status(200).json(news);
		} else {
			const news = await News.create({
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
			res.status(200).json(news);
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const deleteOneNews = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such news!' });
	}
	const lyricsid = await News.findByIdAndDelete({ _id: id });
	if (!lyricsid) {
		return res.status(404).json({ error: 'No such news' });
	}
	const news = await News.find({}).sort({ createdAt: -1 });
	res.status(200).json(news);
};

const addComent = async (req, res, next) => {
	const { comment, username } = req.body;
	try {
		const news = await News.findByIdAndUpdate(
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
			news,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};
module.exports = {
	postSinglenews,
	getAllNews,
	getOneNews,
	deleteOneNews,
	addComent,
	updateNews,
};
