const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');
const Album = require('../models/albummodel');

const getAllAlbum = async (req, res) => {
	const album = await Album.find({}).sort({ createdAt: -1 });
	res.status(200).json(album);
};

const getOneAlbum = async (req, res) => {
	const { title } = req.params;

	const regex = new RegExp(title, 'i');
	const album = await Album.findOne({ title: regex }).populate(
		'comments.postedBy',
		'email'
	);

	if (!album) {
		return res.status(404).json({ error: 'No such album!' });
	}
	res.status(200).json(album);
};

const postSingleAlbum = async (req, res) => {
	// console.log(req.body);
	const {
		title,
		body,
		author,
		audio,
		image,
		name,
		metaKey,
		metaDescription,
		songOwner,
		categ,
	} = req.body;

	try {
		let uploadedAudio;
		let photo;
		try {
			uploadedAudio = await cloudinary.uploader.upload_large(audio, {
				resource_type: 'auto',
				timeout: 120000,
				public_id: `${name}-${songOwner}-Goodvib.net`,
				folder: 'album',
			});
		} catch (error) {
			console.log(error);
			return res.status(401).json({ error: 'Failed to upload SONG' });
		}

		if (!uploadedAudio) {
			return res.status(401).json({ error: 'Failed to upload SONG' });
		}
		try {
			photo = await cloudinary.uploader.upload(image, {
				folder: 'images',
				width: 'auto',
				crop: 'fit',
				use_filename: true,
			});
		} catch (error) {
			console.log(error);
			return res.status(401).json({ error: 'Failed to upload image' });
		}

		if (!photo) {
			return res.status(401).json({ error: 'Failed to upload image' });
		}
		// console.log(photo.secure_url);

		const album = await Album.create({
			title,
			body,
			author,
			metaKey,
			metaDescription,
			name,
			songOwner,
			categ,
			audio: {
				public_id: uploadedAudio.public_id,
				url: uploadedAudio.secure_url,
			},
			image: {
				public_id: photo.public_id,
				url: photo.secure_url,
			},
		});

		res.status(200).json(album);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const patchOneAlbum = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such album!' });
	}
	const album = await Album.findByIdAndUpdate(
		{ _id: id },
		{
			...req.body,
		},
		{ new: true }
	);
	if (!album) {
		return res.status(404).json({ error: 'No such album' });
	}
	res.status(200).json(album);
};

const deleteOneAlbum = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such song!' });
	}
	const lyricsid = await Album.findByIdAndDelete({ _id: id });
	if (!lyricsid) {
		return res.status(404).json({ error: 'No such song' });
	}
	const album = await Album.find({}).sort({ createdAt: -1 });
	res.status(200).json(album);
};

const addComent = async (req, res, next) => {
	const { comment, username } = req.body;
	try {
		const album = await Album.findByIdAndUpdate(
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
			album,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

module.exports = {
	getAllAlbum,
	getOneAlbum,
	postSingleAlbum,
	patchOneAlbum,
	deleteOneAlbum,
	addComent,
};
