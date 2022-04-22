const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.get("/orders", orderController.getAllOrders);
router.get("/orders/:firstname", orderController.getOrder);
router.post("/order", orderController.addOrder);

module.exports = router;