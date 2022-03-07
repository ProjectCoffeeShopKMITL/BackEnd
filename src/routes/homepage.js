const express = require('express');
const homepageController = require('../controllers/homepage.controller');

const router = express.Router();

router.get('/homepage', homepageController.homepage);
router.get('/homepage/section/1', homepageController.getSection1);
router.post('/homepage/section/1', homepageController.addSection1);
router.delete('/homepage/section/1/:id', homepageController.deleteSection1);

module.exports = router;

//CRUD section 1 "/homepage/section/1"
//update section1