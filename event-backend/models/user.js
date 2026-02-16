const mongoose = require("mongoose");  

const userSchema = new mongoose.Schema( {
    username: {
        type: String, 
        required: true, 
        unique: true
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
        enum:["student", "organizer", "admin"], 
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
    
}) 
 module.exports = mongoose.model("User", userSchema); 