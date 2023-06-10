const User = require('../models/usermodel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = _id => {
	return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};
const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		let user;
		try {
			user = await User.login(email, password);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}

		const token = createToken(user._id);
		return res.status(200).json({
			email,
			token,
			role: user.role,
			id: user._id,
			username: user.username,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const signupUser = async (req, res) => {
	const { email, password, username, role } = req.body;
	try {
		let user;
		try {
			user = await User.signup(email, password, username, role);
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}

		const token = createToken(user._id);
		res.status(200).json({ email, username, token, role: user.role });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
const getAllUsers = async (req, res) => {
	const users = await User.find({}).sort({ createdAt: -1 });
	res.status(200).json(users);
};
const deleteOneUser = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) {
		console.log('in');
		return res.status(404).json({ error: 'No such user!' });
	}
	const user = await User.findByIdAndDelete({ _id: id });
	if (!user) {
		return res.status(404).json({ error: 'No such user' });
	}
	const users = await User.find({}).sort({ createdAt: -1 });
	res.status(200).json(users);
};
const getAdmins = async (req, res) => {
	try {
		const adminUsers = await User.find({ role: 'admin' });
		res.status(200).json(adminUsers);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
};
const getOneUser = async (req, res) => {
	console.log(req.params.id);
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};
module.exports = {
	loginUser,
	signupUser,
	getAllUsers,
	deleteOneUser,
	getAdmins,
	getOneUser,
};
