const express = require('express');
const { body } = require('express-validator/check');

const postingsController = require('../controller/postings');
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

router.patch('/postings/:postingId', isAuth , postingsController.patchImageToPosting)

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