const express = require("express");
const { route } = require("express/lib/application");
const homepageController = require("../controllers/homepage.controller");

const router = express.Router();

router.get("/homepage", homepageController.homepage);

//section1
router.get('/homepage/section/1', homepageController.getSection1);
router.post('/homepage/section/1', homepageController.addSection1);
router.put('/homepage/section/1/:id', homepageController.updateSection1);
router.delete('/homepage/section/1/:id', homepageController.deleteSection1);

//section2
router.get('/homepage/section/2', homepageController.getSection2);
router.post('/homepage/section/2', homepageController.addSection2);
router.put('/homepage/section/2/:id', homepageController.updateSection2);
router.delete('/homepage/section/2/:id', homepageController.deleteSection2);

//section3
router.get('/homepage/section/3', homepageController.getSection3);
router.post('/homepage/section/3', homepageController.addSection3);
router.put('/homepage/section/3/:id', homepageController.deleteSection3);
router.delete('/homepage/section/3/:id', homepageController.deleteSection3);

//section4
router.get('/homepage/section/4', homepageController.getSection4);
router.post('/homepage/section/4', homepageController.addSection4);
router.put('/homepage/section/4/:id', homepageController.updateSection4);
router.delete('/homepage/section/4/:id', homepageController.deleteSection4);
module.exports = router;
