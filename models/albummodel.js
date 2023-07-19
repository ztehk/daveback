const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = new Schema(
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
		audio: {
			url: String,
			public_id: String,
		},
		name: {
			type: String,
			required: [true, 'song name is required'],
		},
		categ: {
			type: String,
			required: [true, 'category is required'],
		},
		songOwner: {
			type: String,
			required: [true, 'Artist name is required'],
		},
		image: {
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
module.exports = mongoose.model('Album', AlbumSchema);
