const express = require("express");
const menuController = require("../controllers/menu.controller");

const router = express.Router();

router.get("/menus", menuController.getAllMenu);
router.get("/menus/:name", menuController.getDetailMenu);  
router.get("/menus/recommend", menuController.getRecommendMenu)
router.post("/menus", menuController.addMenu);
router.put("/menus/:id", menuController.updateMenu);
router.delete("/menus/:id", menuController.deleteMenu);

module.exports = router ;