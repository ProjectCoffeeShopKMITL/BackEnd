const express = require("express");
const stockController = require("../controllers/stock.controller");

const router = express.Router();

router.get("/stocks", stockController.getAllStocks);
router.post("/stocks/add", stockController.addNewStock); //add new ingredient
router.post("/stocks/update", stockController.addQuantityStocks);
router.post("/stocks/calculate", stockController.calculateStocks);

module.exports = router;
