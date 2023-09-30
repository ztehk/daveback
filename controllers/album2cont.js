const AWS = require('aws-sdk');
const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');
const Music = require('../models/album2model');
AWS.config.update({
	accessKeyId: 'AKIA4J2SPBEYP4KJ7OON',
	secretAccessKey: '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',
});

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
	const slug = `${name2}-by-${owner2}`;
	try {
		let uploadedAudiourl;
		let photo;
		try {
			console.log('in');
			const s3 = new AWS.S3({
				httpOptions: {
					timeout: 600000, // Set timeout to 60 seconds (adjust as needed)
				},
			});

			await s3
				.putObject({
					Body: audio,
					Bucket: 'goodvib',
					Key: `${name}|${songOwner}.zip`,
				})
				.promise()
				.then(() => {
					uploadedAudiourl = `https://goodvib.s3.eu-north-1.amazonaws.com/${name}|${songOwner}.zip`;
					console.log(uploadedAudiourl);
				})
				.catch(error => {
					console.error(error);
					return res
						.status(401)
						.json({ error: 'Failed to upload song' });
				});
		} catch (error) {
			console.log(error);
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
				url: uploadedAudiourl,
			},
		});

		res.status(200).json(music);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	getAllMusic,
	getOneMusic,
	postSingleMusic,
	// patchOneMusic,
	// deleteOneMusic,
	// addComent,
};
