const express = require('express');
const compression = require('compression');
const app = express();

app.use(compression());
const userRoutes = require('./routes/user');
const lyricsRoutes = require('./routes/Lyrics');
const musicRoutes = require('./routes/music');
const albumRoutes = require('./routes/album');
const searchroute = require('./routes/search');
const newsrout = require('./routes/news');
const newsvideorout = require('./routes/newsvideo');
const sportroute = require('./routes/sport');
const album2 = require('./routes/album2');

const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

app.use(express.json({ limit: '200mb' }));
app.use(cors());
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

app.use('/api/user', userRoutes);
app.use('/api/lyrics', lyricsRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/gospel', albumRoutes);
app.use('/api/gist', newsrout);
app.use('/api/search', searchroute);
app.use('/api/newsvideo', newsvideorout);
app.use('/api/sport', sportroute);
app.use('/api/album', album2);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(
				`connected to db && listening to pport ${process.env.PORT}!!!`
			);
		});
	})
	.catch(error => {
		console.log(error.message);
	});
