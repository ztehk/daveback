const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'title is required'],
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
		videoUrl: {
			url: String,
			public_id: String,
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
module.exports = mongoose.model('Video', VideoSchema);
