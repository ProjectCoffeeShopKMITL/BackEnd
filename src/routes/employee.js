const express = require("express");
const employeeController = require("../controllers/employee.controller");

const router = express.Router();

router.get("/employees", employeeController.getAllEmployees);
router.post("/employees", employeeController.addEmployee);
router.put("/employees/:id", employeeController.updateEmployee);

module.exports = router;