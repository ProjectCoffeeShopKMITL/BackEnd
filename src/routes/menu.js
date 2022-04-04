const express = require("express");
const menuController = require("../controllers/menu.controller");
const fileUpload = require("express-fileupload");

const router = express.Router();

router.get("/menu", menuController.getAllMenu);
router.get("/menu/:name", menuController.getDetailMenu);
router.post("/menu", menuController.addMenu);


module.exports = router ;