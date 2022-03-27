const express = require("express");
const galleryController = require("../controllers/gallery.controller");

const router = express.Router();

router.get("/gallery", galleryController.getGallery);
router.post("/gallery", galleryController.addImage);
router.put("/gallery/:id", galleryController.updateImg);
router.delete("/gallery/:id", galleryController.deleteImg);

module.exports = router;