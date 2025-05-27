// models/Employee.js

const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    employeeId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        unique: true,
        trim: true,
        lowercase: true,
    },
    mobile: {
        type: String,
        required: true,
        match: /^\d{10}$/,
    },
    designation: {
        type: String,
        enum: ["HR", "Manager", "Sales"],
        required: true,
    },
    gender: {
        type: String,
        enum: ["M", "F"],
        required: true,
    },
    course: {
        type: [String],
        validate: v => Array.isArray(v) && v.length > 0,
        required: true,
    },
    image: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    createdDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);
