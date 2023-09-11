const mongoose = require('mongoose');
const Music = require('../models/musicmodel');
const Lyric = require('../models/LyricsModel');
const Album = require('../models/albummodel');
const News = require('../models/newsmodel');

const searchfun = async (req, res) => {
	const { query } = req.query;
	try {
		const searcResults = await search(query);
		res.json(searcResults);
	} catch (error) {
		console.log(error);
	}
};

async function search(query) {
	const regexQuery = query
		.split(' ')
		.map(word => `.*${word}.*`)
		.join('|');
	const searchRegex = new RegExp(regexQuery, 'i');

	const musicResults = await Music.find({ title: searchRegex }).exec();
	const lyricsResults = await Lyric.find({ title: searchRegex }).exec();
	const GospelResults = await Album.find({ title: searchRegex }).exec();
	const NewsResults = await News.find({ title: searchRegex }).exec();

	const combinedResults = [
		...musicResults,
		...GospelResults,
		...lyricsResults,
		...NewsResults,
	];

	return combinedResults;
}
module.exports = {
	searchfun,
};
