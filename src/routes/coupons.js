const express = require("express");
const couponsController = require("../controllers/coupons.controller");

const router = express.Router();

router.get("/members/:id/coupons", couponsController.getAllCoupons);

module.exports = router;