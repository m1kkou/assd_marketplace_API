const express = require('express');

const imageController = require('../controller/images');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.route('/').post( isAuth, imageController.postImage);

//router.delete();

module.exports = router;