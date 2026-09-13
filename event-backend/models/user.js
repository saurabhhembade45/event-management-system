const mongoose = require("mongoose");  

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: false
    }, 
    email: {
        type: String, 
        required: true, 
        unique: true
    }, 
    password: {
        type: String, 
        required: true
    }, 
    role: {
        type: String, 
        enum: ["Student", "Admin"], 
        default: "Student",
        required: true
    },
    college: {
        type: String,
        required: true,
        enum: [
            "DY Patil Pune",
            "COEP Pune",
            "VIT Pune",
            "PCCOE Pune",
            "MIT WPU"
        ]
    }
});

const User = mongoose.model("User", userSchema);

// Sync indexes to drop legacy unique index on username in MongoDB
User.syncIndexes().catch((err) => console.log("Index sync info:", err.message));

module.exports = User;