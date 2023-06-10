const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');
const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: [true, 'username already exists'],
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: 'user',
			enum: ['user', 'admin'],
		},
	},
	{ timestamps: true }
);

userSchema.statics.signup = async function (email, password, username, role) {
	const emailExists = await this.findOne({ email });
	const userExists = await this.findOne({ username });
	if (!email || !password || !username) {
		throw Error('all fields must be filled!');
	}
	if (!validator.isEmail(email)) {
		throw Error('email is not valid!');
	}

	if (emailExists) {
		throw Error('email already in use!');
	}

	if (userExists) {
		throw Error('username already in use');
	}
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const user = await this.create({ username, email, password: hash, role });

	return user;
};

userSchema.statics.login = async function (email, password) {
	if (!email || !password) {
		throw Error('all fields must be filled!');
	}
	const user = await this.findOne({ email });

	if (!user) {
		throw Error('no such user!');
	}

	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		throw Error('incorrect password!');
	}
	return user;
};
module.exports = mongoose.model('User', userSchema);
