const express = require("express");
const aboutUsController = require("../controllers/aboutUs.controller");

const router = express.Router();

router.get("/about_us", aboutUsController.getAll);
router.put("/about_us/:id", aboutUsController.updateInfo);

module.exports = router;