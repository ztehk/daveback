const mongoose = require('mongoose');
const Music = require('../models/musicmodel');
const Lyric = require('../models/LyricsModel');
const Album = require('../models/albummodel');
const News = require('../models/newsmodel');
const Sport = require('../models/sportmodel');
const Album2 = require('../models/album2model');

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

    // Search in Music collection based on title or artist
    const musicResults = await Music.find({ $or: [{ songOwner: searchRegex }, { title: searchRegex }] }).exec();

    // Search in Lyric collection based on title or artist
    const lyricsResults = await Lyric.find({ $or: [{ songOwner: searchRegex }, { title: searchRegex }] }).exec();

    // Search in Album collection based on title or artist
    const gospelResults = await Album.find({ $or: [{ songOwner: searchRegex }, { title: searchRegex }] }).exec();

    // Search in News collection based on title
    const newsResults = await News.find({ title: searchRegex }).exec();

    // Search in Sport collection based on title
    const sportResults = await Sport.find({ title: searchRegex }).exec();

    // Search in Album2 collection based on title
    const album2Results = await Album2.find({ title: searchRegex }).exec();

    // Combine the results from all collections
    const combinedResults = [
        ...sportResults,
        ...gospelResults,
        ...lyricsResults,
        ...newsResults,
        ...album2Results,
        ...musicResults,
    ];

    return combinedResults.reverse();
}

module.exports = {
	searchfun,
};
