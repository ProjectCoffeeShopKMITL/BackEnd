const express = require("express");
const employeeController = require("../controllers/employee.controller");

const router = express.Router();

router.get("/employees", employeeController.getAllEmployees);
router.post("/employees", employeeController.addEmployee);
router.put("/employees/:id", employeeController.updateEmployee);
router.post("/employees/login/:id", employeeController.loginEmployee);
router.post("/employees/logout/:id", employeeController.logoutEmployee);
router.delete("/employees/delete/:id", employeeController.deleteEmployee);

module.exports = router;