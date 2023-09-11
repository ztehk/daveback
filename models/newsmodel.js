const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'title is required'],
		},
		slug: {
			type: String,
			required: [true, 'slug is required'],
		},
		body: {
			type: String,
			required: [true, 'body is required'],
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
		categ: {
			type: String,
			required: [true, 'category is required'],
		},
		video: {
			url: String,
			public_id: String,
			// required: [true, 'image is required'],
		},
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
module.exports = mongoose.model('News', NewsSchema);
