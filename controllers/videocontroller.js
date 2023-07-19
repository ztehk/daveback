const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');
const Video = require('../models/videosmodel');

const getAllVideo = async (req, res) => {
	const video = await Video.find({}).sort({ createdAt: -1 });
	res.status(200).json(video);
};

const getOneVideo = async (req, res) => {
	const { title } = req.params;

	const regex = new RegExp(title, 'i');
	const video = await Video.findOne({ title: regex }).populate(
		'comments.postedBy',
		'email'
	);

	if (!video) {
		return res.status(404).json({ error: 'No such music!' });
	}
	res.status(200).json(video);
};

const postSingleVideo = async (req, res) => {
	// console.log(req.body);
	const { title, body, author, video, metaKey, metaDescription } = req.body;

	try {
		// console.log(title, body, intro, conclusion, author, image);

		let uploadedAudio;

		try {
			uploadedAudio = await cloudinary.uploader.upload(video, {
				resource_type: 'auto',
				folder: 'music',
			});
		} catch (error) {
			return res.status(401).json({ error: 'Failed to upload image' });
		}

		if (!uploadedAudio) {
			return res.status(401).json({ error: 'Failed to upload image' });
		}

		// console.log(photo.secure_url);

		const video = await Video.create({
			title,
			body,
			conclusion,
			author,
			metaKey,
			metaDescription,
			image: {
				public_id: photo.public_id,
				url: photo.secure_url,
			},
		});

		res.status(200).json(video);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const patchOneVideo = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such music!' });
	}
	const video = await Video.findByIdAndUpdate(
		{ _id: id },
		{
			...req.body,
		},
		{ new: true }
	);
	if (!video) {
		return res.status(404).json({ error: 'No such music' });
	}
	res.status(200).json(video);
};

const deleteOneVideo = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such post!' });
	}
	const lyricsid = await Video.findByIdAndDelete({ _id: id });
	if (!lyricsid) {
		return res.status(404).json({ error: 'No such post' });
	}
	const video = await Video.find({}).sort({ createdAt: -1 });
	res.status(200).json(video);
};

const addComent = async (req, res, next) => {
	const { comment, username } = req.body;
	try {
		const video = await Video.findByIdAndUpdate(
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
			music,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

module.exports = {
	getAllVideo,
	getOneVideo,
	postSingleVideo,
	patchOneVideo,
	deleteOneVideo,
	addComent,
};
