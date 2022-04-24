const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.get("/orders", orderController.getAllOrders);
router.get("/orders/member/:id", orderController.getOrderForMember);
router.get("/orders/guest/:firstname", orderController.getOrderForGuest);
router.post("/order", orderController.addOrder);
router.get("/order/:id", orderController.getListMenu);
router.put("/orders/:id", orderController.updateOrder);
router.delete("/orders/:id", orderController.deleteOrder);

router.put("/orders/:id/status/:status_now", orderController.updateStatusOrder);
module.exports = router;
