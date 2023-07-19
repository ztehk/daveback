const express = require('express');
const router = express.Router();

const { searchfun } = require('../controllers/searchcontroller');

router.get('/', searchfun);

module.exports = router;
