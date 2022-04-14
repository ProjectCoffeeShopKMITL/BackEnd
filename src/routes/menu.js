const express = require("express");
const menuController = require("../controllers/menu.controller");

const router = express.Router();

router.get("/menu", menuController.getAllMenu);
router.get("/menu/:name", menuController.getDetailMenu);  
router.get("/menu/recommend", menuController.getRecommendMenu)
router.post("/menu", menuController.addMenu);
router.put("/menu/:id", menuController.updateMenu);
router.delete("/menu/:id", menuController.deleteMenu);

module.exports = router ;