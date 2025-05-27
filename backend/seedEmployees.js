require("dotenv").config();
const mongoose = require("mongoose");
const Employee = require("./models/Employee");

const dummyEmployees = [
    {
        image: "https://i.pravatar.cc/150?img=11",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        mobile: "9876543210",
        designation: "Software Engineer",
        gender: "F",
        course: ["MCA"],
        status: "Active",
    },
    {
        image: "https://i.pravatar.cc/150?img=12",
        name: "Bob Williams",
        email: "bob.williams@example.com",
        mobile: "9876501234",
        designation: "Team Lead",
        gender: "M",
        course: ["BCA"],
        status: "Inactive",
    },
    {
        image: "https://i.pravatar.cc/150?img=13",
        name: "Carol Smith",
        email: "carol.smith@example.com",
        mobile: "9123456789",
        designation: "HR Manager",
        gender: "F",
        course: ["MBA"],
        status: "Active",
    },
    {
        image: "https://i.pravatar.cc/150?img=14",
        name: "David Lee",
        email: "david.lee@example.com",
        mobile: "9988776655",
        designation: "UX Designer",
        gender: "M",
        course: ["Design"],
        status: "Active",
    },
    {
        image: "https://i.pravatar.cc/150?img=15",
        name: "Eva Green",
        email: "eva.green@example.com",
        mobile: "9090909090",
        designation: "Intern",
        gender: "F",
        course: ["BCA"],
        status: "Inactive",
    },
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected.");

        await Employee.deleteMany(); // Optional: Clear existing data
        console.log("Old employees removed.");

        await Employee.insertMany(dummyEmployees);
        console.log("Dummy employees inserted successfully.");
    } catch (err) {
        console.error("Error seeding employees:", err);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();
