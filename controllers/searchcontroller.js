const mongoose = require("mongoose");
const Music = require("../models/musicmodel");
const Lyric = require("../models/athleticsmodel");
const Album = require("../models/boxingmodel");
const News = require("../models/celebritymodel");
const Sport = require("../models/coursesmodel");
const Tech = require("../models/techmodel");
const Finance = require("../models/financenewsmodel");
const Football = require("../models/footballmodel");
const Forex = require("../models/forexmodel");
const Gist = require("../models/gistmodel");
const Money = require("../models/moneymodels");
const Tene = require("../models/toptenmodels");
const politics = require("../models/politicsmodel");

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
  const sanitizedQuery = query.replace(/\bft\b/gi, "");

  const searchWords = sanitizedQuery.split(" ").filter((item) => item !== "");
  const searchRegexes = searchWords.map(
    (word) => new RegExp(`.*${word}.*`, "i")
  );

  // Search in Music collection based on title or songOwner (with "ft" filtered out)
  const musicResults = await Music.find({
    $or: [{ title: searchRegexes }, { songOwner: searchRegexes }],
  }).exec();

  // Search in Lyric collection based on title or songOwner (with "ft" filtered out)
  const lyricsResults = await Lyric.find({
    $or: [{ title: searchRegexes }, { songOwner: searchRegexes }],
  }).exec();

  // Search in Album collection based on title or songOwner (with "ft" filtered out)
  const gospelResults = await Album.find({
    $or: [{ title: searchRegexes }, { songOwner: searchRegexes }],
  }).exec();

  // Search in News collection based on title
  const newsResults = await News.find({ title: searchRegexes }).exec();

  // Search in Sport collection based on title
  const sportResults = await Sport.find({ title: searchRegexes }).exec();

  // Search in Album2 collection based on title
  const album2Results = await Tene.find({ title: searchRegexes }).exec();

  // Combine the results from all collections
  const combinedResults = [
    ...sportResults,
    ...gospelResults,
    ...newsResults,
    ...lyricsResults,
    ...musicResults,
    ...album2Results,
  ];

  return combinedResults.reverse();
}

module.exports = {
  searchfun,
};
