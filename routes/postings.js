const express = require('express');
const { body } = require('express-validator/check');


const postingsController = require('../controller/postings');
const imageController = require('../controller/images');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

//GET /postings

router.get('/', postingsController.getPostings);

router.get('/:postingId', postingsController.getPosting);

//Validaatiot - tänne vois lisätä
//POST /postings/:postingId
router.post('/', 
    isAuth, 
    [
        body('title').trim().isLength({ min: 5 }),
        body('description').trim().isLength({ min: 5 })
    ], 
    postingsController.postPosting
);

router.patch('/:postingId', isAuth , postingsController.patchImageToPosting);

router.put('/:postingId', 
    isAuth, 
    [
        body('title')
        .trim()
        .isLength({min: 5}),
        body('description')
        .trim()
        .isLength({min: 5})
    ], 
    postingsController.updatePosting
);



router.delete('/:postingId', isAuth, postingsController.deletePosting);

module.exports = router;