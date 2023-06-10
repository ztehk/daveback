const express = require('express');
const compression = require('compression');
const app = express();

app.use(compression());
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/Post');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

app.use('/api/user', userRoutes);
app.use('/api/blogs', blogRoutes);

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
