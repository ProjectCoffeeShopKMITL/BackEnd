const express = require("express");
const stockController = require("../controllers/stock.controller");

const router = express.Router();

router.get("/stocks", stockController.getAllStocks);
router.post("/stocks/add", stockController.addNewStock); //add new ingredient
router.put("/stocks/update/:id", stockController.updateStocks);
router.post("/stocks/calculate", stockController.calculateStocks);
router.delete("/stocks/delete/:id", stockController.deleteStock);

module.exports = router;
