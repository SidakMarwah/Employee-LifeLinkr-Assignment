const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const employeeController = require("../controllers/employeeController");

const router = express.Router();

// GET /api/employees
router.get("/", verifyToken, employeeController.getAllEmployees);

// POST /api/employees
router.post("/", verifyToken, employeeController.createEmployee);

// PATCH /api/employees/:id/status
router.patch("/:id/status", verifyToken, employeeController.toggleEmployeeStatus);

// DELETE /employees/:id
router.delete("/:id", verifyToken, employeeController.deleteEmployee);

// PUT /employees/:id
router.put("/:id", verifyToken, employeeController.updateEmployee);

// GET /employees/:id
router.get("/:id", verifyToken, employeeController.getEmployeeById);

module.exports = router;
