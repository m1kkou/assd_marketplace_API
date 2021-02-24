const express = require('express');
const { body } = require('express-validator/check');
const { multerParser } = require('../util/multer');

const postingsController = require('../controller/postings');
const imageController = require('../controller/images');

const isAuth = require('../middleware/is-auth');


const router = express.Router();

//GET /postings

router.get('/postings', postingsController.getPostings);

router.get('/postings/:postingId', postingsController.getPosting);

//Validaatiot - tänne vois lisätä
//POST /postings/:postingId
router.post('/postings', isAuth, [
    body('title').trim().isLength({min: 5}),
    body('description').trim().isLength({min: 5})
] , postingsController.postPosting);

//router.patch('/postings/:postingId', isAuth , postingsController.patchImageToPosting);

//router.route('/postings/:postingId').patch(parser.single('image'), isAuth, postingsController.patchImageToPosting);
router.route('/postings/:postingId/:imageId').post(multerParser.single('image'), isAuth, imageController.postImage);

router.put('/postings/:postingId', isAuth, [
    body('title')
    .trim()
    .isLength({min: 5}),
    body('description')
    .trim()
    .isLength({min: 5})
    ], 
    postingsController.updatePosting);



router.delete('/postings/:postingId', isAuth, postingsController.deletePosting);

module.exports = router;