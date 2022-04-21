const express = require("express");
const galleryController = require("../controllers/gallery.controller");

const router = express.Router();

router.get("/gallerys", galleryController.getGallery);
router.post("/gallerys", galleryController.addImage);
router.put("/gallerys/:id", galleryController.updateImg);
router.delete("/gallerys/:id", galleryController.deleteImg);

module.exports = router;