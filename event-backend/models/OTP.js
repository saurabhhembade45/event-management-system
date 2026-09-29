const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // TTL index: automatically deletes document after 5 minutes (300s)
    },
    lastSentAt: {
        type: Date,
        default: Date.now
    }
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
