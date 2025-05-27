const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const Counter = require("../models/Counter");
const Employee = require("../models/Employee");
const s3 = require("../utils/s3client");

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdDate: -1 });
        res.json(employees);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        // 1) Auto-increment ID
        const counter = await Counter.findOneAndUpdate(
            { name: "employeeId" },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        // 2) Pull data from req.body (which holds all fields, including the S3 image URL)
        const {
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image,    // <-- this is the S3 URL your frontend sent
        } = req.body;

        // Check if an existing employee has the same email
        const existing = await Employee.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // 3) Build the new employee object
        const emp = await Employee.create({
            employeeId: counter.value,
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image,    // Save the S3 URL here
        });

        return res.status(201).json(emp);
    } catch (err) {
        console.error("Create Employee Error:", err);
        // 💡 Handle duplicate email error
        if (err.code === 11000 && err.keyPattern?.email) {
            return res.status(400).json({ message: "Email already exists." });
        }
        return res.status(500).json({ message: "Failed to create employee" });
    }
};

// Toggle employee status (Activate / Deactivate)
exports.toggleEmployeeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        return res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error("Error updating employee status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Employee.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return res.status(500).json({ message: 'Server error while deleting employee' });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image
        } = req.body;

        // Check if the new email already exists on a different employee
        const existing = await Employee.findOne({ email, _id: { $ne: id } });
        if (existing) {
            return res.status(400).json({ message: "Email already in use by another employee." });
        }

        const updatedFields = {
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image,
        };

        const updated = await Employee.findByIdAndUpdate(id, updatedFields, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(updated);
    } catch (err) {
        console.error("Error updating employee:", err);
        // 💡 Handle duplicate email error on update too
        if (err.code === 11000 && err.keyPattern?.email) {
            return res.status(400).json({ message: "Email already exists." });
        }
        res.status(500).json({ message: "Server error" });
    }
};

exports.getEmployeeById = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee);
    } catch (err) {
        console.error("Error fetching employee by ID:", err);
        res.status(500).json({ message: "Server error" });
    }
};
