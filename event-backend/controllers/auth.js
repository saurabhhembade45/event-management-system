const User = require("../models/user");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
const { sendOTPEmail } = require("../config/nodemailer");

// Helper function to generate a random 6-digit numeric OTP string
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to trigger non-blocking email sending and console logging
const dispatchOTP = (email, rawOtp) => {
    console.log(`\n==========================================`);
    console.log(`🔑 [OTP DEBUG LOG] Verification code for ${email}: ${rawOtp}`);
    console.log(`==========================================\n`);

    // Non-blocking async call so HTTP response completes in milliseconds
    sendOTPEmail(email, rawOtp).catch((err) => {
        console.error("Async email dispatch error:", err.message);
    });
};

exports.register = async (req, res) => {
    try { 
        const { username, email, password, college } = req.body;  

        if (!username || !email || !password || !college) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if user already exists in User collection
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered with this email. Please log in.",
            }); 
        }

        const hashedPass = await bcrypt.hash(password, 10); 
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        let role = "Student"; // default
        if (ADMIN_EMAIL && email === ADMIN_EMAIL) {
            role = "Admin";
        }

        // Generate 6-digit OTP
        const rawOtp = generateOTP();
        const hashedOtp = await bcrypt.hash(rawOtp, 10);

        // Store PENDING user registration details + OTP in MongoDB (expires in 5 minutes)
        // User entry in main User collection is ONLY created after OTP is successfully verified!
        await OTP.findOneAndUpdate(
            { email },
            {
                email,
                otp: hashedOtp,
                username,
                password: hashedPass,
                college,
                role,
                createdAt: new Date(),
                lastSentAt: new Date()
            },
            { upsert: true, returnDocument: 'after' }
        );

        // Non-blocking dispatch
        dispatchOTP(email, rawOtp);

        return res.status(200).json({
            success: true, 
            message: "OTP sent to your email. Please verify to complete account registration.",
            email,
            requiresVerification: true,
        });
    }
    catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            success: false,
            message: "Registration failed",
        }); 
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        // Check if user is already registered in User collection
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered and verified. Please log in.",
            });
        }

        // Find pending registration record in OTP collection
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired or registration session lost. Please sign up again.",
            });
        }

        // Compare entered OTP with hashed OTP
        const isOTPValid = await bcrypt.compare(otp.toString(), otpRecord.otp);
        if (!isOTPValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please check the code and try again.",
            });
        }

        // NOW create the permanent User document in User collection after OTP validation
        const user = await User.create({
            username: otpRecord.username,
            email: otpRecord.email,
            password: otpRecord.password,
            college: otpRecord.college,
            role: otpRecord.role || "Student",
            isEmailVerified: true
        });

        // Delete pending OTP record
        await OTP.deleteOne({ _id: otpRecord._id });

        // Generate JWT Token for automatic direct login
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            username: user.username,
            name: user.username,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(201).json({
            success: true,
            token,
            user: userObj,
            message: "Registration & email verification successful! Welcome to Eventopia 🎉",
        });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        return res.status(500).json({
            success: false,
            message: "OTP verification failed",
        });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Check if user is already registered in User collection
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Account already exists for this email. Please log in.",
            });
        }

        // Find pending registration record in OTP collection
        const pendingOTP = await OTP.findOne({ email });
        if (!pendingOTP) {
            return res.status(404).json({
                success: false,
                message: "No pending registration found for this email. Please sign up again.",
            });
        }

        // Rate limiting check (60 seconds cooldown)
        if (pendingOTP.lastSentAt) {
            const timeDiffSeconds = (new Date() - new Date(pendingOTP.lastSentAt)) / 1000;
            const cooldown = 60; // 60s cooldown
            if (timeDiffSeconds < cooldown) {
                const remaining = Math.ceil(cooldown - timeDiffSeconds);
                return res.status(429).json({
                    success: false,
                    message: `Please wait ${remaining} seconds before requesting a new OTP.`,
                    retryAfterSeconds: remaining
                });
            }
        }

        // Generate new 6-digit OTP
        const rawOtp = generateOTP();
        const hashedOtp = await bcrypt.hash(rawOtp, 10);

        // Update OTP record
        pendingOTP.otp = hashedOtp;
        pendingOTP.createdAt = new Date();
        pendingOTP.lastSentAt = new Date();
        await pendingOTP.save();

        // Non-blocking dispatch
        dispatchOTP(email, rawOtp);

        return res.status(200).json({
            success: true,
            message: "A new 6-digit OTP has been sent to your email.",
        });
    } catch (error) {
        console.error("Resend OTP Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to resend OTP",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; 

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            }); 
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password); 
        
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password for this mail",
            }); 
        }

        // Enforce email verification check
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                isEmailVerified: false,
                message: "Please verify your email before logging in.",
                email: user.email
            });
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            username: user.username,
            name: user.username,
        }; 
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });
        user.password = undefined; 

        res.status(200).json({
            success: true,
            token,
            user,
            message: "login Successfull", 
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        }); 
    }
};