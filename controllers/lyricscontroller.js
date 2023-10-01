const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');
const Lyric = require('../models/LyricsModel');

async function updateLyrics() {
	try {
		const currentDate = new Date();
		await Lyric.updateMany({}, { $set: { updatedAt: currentDate } });
	} catch (error) {
		console.error('Error updating updatedAt:', error);
	}
}
const getAllLyrics = async (req, res) => {
	const lyrics = await Lyric.find({}).sort({ createdAt: -1 });
	res.status(200).json(lyrics);
};

const getOneLyrics = async (req, res) => {
	const { title } = req.params;

	const regex = new RegExp(title, 'i');
	const lyrics = await Lyric.findOne({ slug: regex }).populate(
		'comments.postedBy',
		'email'
	);

	if (!lyrics) {
		return res.status(404).json({ error: 'No such blog lyrics!' });
	}
	res.status(200).json(lyrics);
};

const postSingleLyrics = async (req, res) => {
	// console.log(req.body);
	const {
		title,
		body,
		author,
		image,
		metaKey,
		metaDescription,
		name,
		songOwner,
		categ,
	} = req.body;
	const name2 = name.replace(/ /g, '-');
	const owner2 = songOwner.replace(/ /g, '-');
	const slug = `${name2}-by-${owner2}-lyrics`;
	try {
		// console.log(title, body, intro, conclusion, author, image);

		let photo;

		try {
			photo = await cloudinary.uploader.upload(image, {
				folder: 'images',
				width: 'auto',
				crop: 'fit',
			});
		} catch (error) {
			return res.status(401).json({ error: 'Failed to upload image' });
		}

		if (!photo) {
			return res.status(401).json({ error: 'Failed to upload image' });
		}

		// console.log(photo.secure_url);

		const lyrics = await Lyric.create({
			title,
			body,
			author,
			metaKey,
			metaDescription,
			slug,
			name,
			songOwner,
			categ,
			image: {
				public_id: photo.public_id,
				url: photo.secure_url,
			},
		});

		res.status(200).json(lyrics);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const patchOneLyrics = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such lyrics!' });
	}
	const lyric = await Lyric.findById(id);
	if (req.image !== '') {
		const imgid = lyric.image.public_id;
		if (imgid) {
			cloudinary.uploader.destroy(imgid);
		}
		try {
			let photo = await cloudinary.uploader.upload(req.body.image, {
				folder: 'images',
				width: 'auto',
				crop: 'fit',
			});
			if (photo) {
				req.body.image = {
					public_id: photo.public_id,
					url: photo.url,
				};
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: 'could not upload image' });
		}
	}
	const lyrics = await Lyric.findByIdAndUpdate(
		{ _id: id },
		{
			...req.body,
		},
		{ new: true }
	);
	if (!lyrics) {
		return res.status(404).json({ error: 'No such lyrics' });
	}
	res.status(200).json(lyrics);
};

const deleteOneLyrics = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such lyrics!' });
	}
	const lyricsid = await Lyric.findByIdAndDelete({ _id: id });
	if (!lyricsid) {
		return res.status(404).json({ error: 'No such lyrics' });
	}
	const lyrics = await Lyric.find({}).sort({ createdAt: -1 });
	res.status(200).json(lyrics);
};

const addComent = async (req, res, next) => {
	const { comment, username } = req.body;
	try {
		const lyrics = await Lyric.findByIdAndUpdate(
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
			lyrics,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

module.exports = {
	getAllLyrics,
	getOneLyrics,
	postSingleLyrics,
	patchOneLyrics,
	deleteOneLyrics,
	addComent,
	updateLyrics,
};
