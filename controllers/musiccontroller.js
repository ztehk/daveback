const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');
const Music = require('../models/musicmodel');

const getAllMusic = async (req, res) => {
	const music = await Music.find({}).sort({ createdAt: -1 });
	res.status(200).json(music);
};

const getOneMusic = async (req, res) => {
	const { title } = req.params;
	const regex = new RegExp(title, 'i');
	const music = await Music.findOne({ slug: regex }).populate(
		'comments.postedBy',
		'email'
	);

	if (!music) {
		return res.status(404).json({ error: 'No such music!' });
	}
	res.status(200).json(music);
};

const postSingleMusic = async (req, res) => {
	// console.log(req.body);
	const {
		title,
		body,
		author,
		audio,
		metaKey,
		metaDescription,
		image,
		name,
		songOwner,
		categ,
	} = req.body;
	const name2 = name.replace(/ /g, '-');
	const owner2 = songOwner.replace(/ /g, '-');
	const slug = `download-${name2}-by-${owner2}-mp3`;
	try {
		let uploadedAudio;
		let photo;
		try {
			uploadedAudio = await cloudinary.uploader.upload(audio, {
				timeout: 240000,
				resource_type: 'auto',
				public_id: `${name}-${songOwner}-Goodvib.net`,
				folder: 'music',
			});
		} catch (error) {
			console.log(error);
			return res.status(401).json({ error: 'Failed to upload song' });
		}

		if (!uploadedAudio) {
			return res.status(401).json({ error: 'Failed to upload song' });
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
		try {
			await cloudinary.uploader.explicit(uploadedAudio.public_id, {
				type: 'upload',
				overwrite: true,
				resource_type: 'video', // Use 'video' resource type for audio files in Cloudinary
				context: `cover_art_url=${photo.secure_url}`,
			});
		} catch (error) {
			console.error('Error updating audio metadata:', error);
			return res
				.status(401)
				.json({ error: 'Failed to update audio metadata' });
		}
		// console.log(photo.secure_url);

		const music = await Music.create({
			title,
			body,
			author,
			metaKey,
			metaDescription,
			name,
			songOwner,
			slug,
			categ,
			image: {
				public_id: photo.public_id,
				url: photo.secure_url,
			},
			audio: {
				public_id: uploadedAudio.public_id,
				url: uploadedAudio.secure_url,
			},
		});

		res.status(200).json(music);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const patchOneMusic = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		console.log('error');
		return res.status(404).json({ error: 'No such music!' });
	}
	const musik = await Music.findById(id);
	if (req.body.image !== '') {
		const imgid = musik.image.public_id;
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
	if (req.body.audio !== '') {
		const audiioid = musik.audio.public_id;
		if (audiioid) {
			cloudinary.uploader.destroy(audiioid);
		}
		try {
			uploadedAudio = await cloudinary.uploader.upload(
				req.body.audio,
				{
					timeout: 240000,
					resource_type: 'auto',
					public_id: `${req.name}-${req.songOwner}-Goodvib.net`,
					folder: 'music',
				}
			);
			if (uploadedAudio) {
				req.body.audio = {
					public_id: uploadedAudio.public_id,
					url: uploadedAudio.url,
				};
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: 'could not upload image' });
		}
	}
	const music = await Music.findByIdAndUpdate(
		{ _id: id },
		{
			...req.body,
		},
		{ new: true }
	);
	if (!music) {
		return res.status(404).json({ error: 'No such music' });
	}
	console.log('done');
	console.log(music);
	res.status(200).json(music);
};

const deleteOneMusic = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such music!' });
	}
	const lyricsid = await Music.findByIdAndDelete({ _id: id });
	if (!lyricsid) {
		return res.status(404).json({ error: 'No such music' });
	}
	const music = await Music.find({}).sort({ createdAt: -1 });
	res.status(200).json(music);
};

const addComent = async (req, res, next) => {
	const { comment, username } = req.body;
	try {
		const music = await Music.findByIdAndUpdate(
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
	getAllMusic,
	getOneMusic,
	postSingleMusic,
	patchOneMusic,
	deleteOneMusic,
	addComent,
};
