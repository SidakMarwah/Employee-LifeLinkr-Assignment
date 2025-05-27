const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

async function createAdmin() {
    await mongoose.connect(process.env.MONGO_URI);
    const hashed = await bcrypt.hash("put_password_here", 10);
    await User.create({ username: "put_username_here", password: hashed });
    console.log("Admin created");
    process.exit();
}

createAdmin();
