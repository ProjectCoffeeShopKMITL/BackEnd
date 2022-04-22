const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.get("/orders", orderController.getAllOrders);
router.get("/orders/:firstname", orderController.getOrder);
router.post("/order", orderController.addOrder);
router.get("/order/:id", orderController.getListMenu);

module.exports = router;
