const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'title is required'],
		},
		intro: {
			type: String,
			required: [true, 'intro is required'],
		},
		body: {
			type: String,
			required: [true, 'body is required'],
		},
		conclusion: {
			type: String,
			required: true,
		},
		metaKey: {
			type: String,
			required: true,
		},
		metaDescription: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: [true, 'author is required'],
		},
		image: {
			url: String,
			public_id: String,
			// required: [true, 'image is required'],
		},
		likes: [{ type: String }],
		comments: [
			{
				text: {
					type: String,
				},
				postedBy: {
					type: String,
					required: true,
				},
				created: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true }
);

// const BlogPost = mongoose.model('Post')
module.exports = mongoose.model('Post', PostSchema);
