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
    // Replace "ft" with an empty string in the query
    const sanitizedQuery = query.replace(/\bft\b/gi, '');

    const searchWords = sanitizedQuery.split(' ');

    const searchRegexes = searchWords.map(word => new RegExp(`.*${word}.*`, 'i'));

    // Define different combinations of search terms
    const combinations = [];
    for (let i = 0; i < searchWords.length; i++) {
        for (let j = i + 1; j <= searchWords.length; j++) {
            combinations.push(searchWords.slice(i, j).join(' '));
        }
    }

    // Search in Music collection based on title or songOwner (with "ft" filtered out)
    const musicResults = await Music.find({
        $or: [
            { title: { $all: searchRegexes } },
            { songOwner: { $all: searchRegexes } }
        ]
    }).exec();

    // Search in Lyric collection based on title or songOwner (with "ft" filtered out)
    const lyricsResults = await Lyric.find({
        $or: [
            { title: { $all: searchRegexes } },
            { songOwner: { $all: searchRegexes } }
        ]
    }).exec();

    // Search in Album collection based on title or songOwner (with "ft" filtered out)
    const gospelResults = await Album.find({
        $or: [
            { title: { $all: searchRegexes } },
            { songOwner: { $all: searchRegexes } }
        ]
    }).exec();

    // Search in News collection based on title
    const newsResults = await News.find({ title: { $all: searchRegexes } }).exec();

    // Search in Sport collection based on title
    const sportResults = await Sport.find({ title: { $all: searchRegexes } }).exec();

    // Search in Album2 collection based on title
    const album2Results = await Album2.find({ title: { $all: searchRegexes } }).exec();

    // Combine the results from all collections
    const combinedResults = [
        ...sportResults,
        ...gospelResults,
        ...newsResults,
        ...lyricsResults,
        ...album2Results,
        ...musicResults,
    ];

    // Filter out duplicates
    const uniqueResults = Array.from(new Set(combinedResults.map(result => result._id))).map(_id => combinedResults.find(result => result._id === _id));

    return uniqueResults.reverse();
}




module.exports = {
	searchfun,
};
