const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');
const Post = require('../models/postmodel');

const getAllPost = async (req, res) => {
	const posts = await Post.find({}).sort({ createdAt: -1 });
	res.status(200).json(posts);
};

const getOnePost = async (req, res) => {
	const { title } = req.params;

	const regex = new RegExp(title, 'i');
	const post = await Post.findOne({ title: regex }).populate(
		'comments.postedBy',
		'email'
	);

	if (!post) {
		return res.status(404).json({ error: 'No such blog post!' });
	}
	res.status(200).json(post);
};

const postSinglePost = async (req, res) => {
	// console.log(req.body);
	const {
		title,
		body,
		intro,
		conclusion,
		author,
		image,
		metaKey,
		metaDescription,
	} = req.body;

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

		const post = await Post.create({
			title,
			intro,
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

		res.status(200).json(post);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const patchOnePost = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such Post!' });
	}
	const post = await Post.findByIdAndUpdate(
		{ _id: id },
		{
			...req.body,
		},
		{ new: true }
	);
	if (!post) {
		return res.status(404).json({ error: 'No such post' });
	}
	res.status(200).json(post);
};

const deleteOnePost = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'No such post!' });
	}
	const post = await Post.findByIdAndDelete({ _id: id });
	if (!post) {
		return res.status(404).json({ error: 'No such post' });
	}
	const posts = await Post.find({}).sort({ createdAt: -1 });
	res.status(200).json(posts);
};

const addComent = async (req, res, next) => {
	const { comment, username } = req.body;
	try {
		const post = await Post.findByIdAndUpdate(
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
			post,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

const addLikes = async (req, res, next) => {
	const { username } = req.body;
	try {
		const post = await Post.findByIdAndUpdate(req.params.id, {
			$push: { likes: username },
		});
		res.status(200).json({
			success: true,
			post,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};
module.exports = {
	getAllPost,
	getOnePost,
	postSinglePost,
	patchOnePost,
	deleteOnePost,
	addComent,
	addLikes,
};
