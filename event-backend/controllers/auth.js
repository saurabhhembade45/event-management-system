const User = require("../models/user");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
const { sendOTPEmail } = require("../config/nodemailer");

// Helper function to generate a random 6-digit numeric OTP string
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
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

        const existingUser = await User.findOne({ email }); 
        
        if (existingUser) {
            if (existingUser.isEmailVerified) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists for this mail",
                }); 
            } else {
                // Unverified existing user: update credentials and send a fresh OTP
                const hashedPass = await bcrypt.hash(password, 10);
                existingUser.username = username;
                existingUser.password = hashedPass;
                existingUser.college = college;
                await existingUser.save();

                const rawOtp = generateOTP();
                const hashedOtp = await bcrypt.hash(rawOtp, 10);

                await OTP.findOneAndUpdate(
                    { email },
                    { 
                        otp: hashedOtp, 
                        createdAt: new Date(), 
                        lastSentAt: new Date() 
                    },
                    { upsert: true, new: true }
                );

                try {
                    await sendOTPEmail(email, rawOtp);
                } catch (mailErr) {
                    console.error("Failed sending OTP email during re-registration:", mailErr.message);
                }

                const userObj = existingUser.toObject();
                delete userObj.password;

                return res.status(200).json({
                    success: true,
                    message: "User registration updated. Please verify your email using the 6-digit OTP sent.",
                    user: userObj,
                    requiresVerification: true,
                });
            }
        }

        const hashedPass = await bcrypt.hash(password, 10); 
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

        let role = "Student";   // default
        if (ADMIN_EMAIL && email === ADMIN_EMAIL) {
            role = "Admin";
        }

        // Create User with isEmailVerified: false
        const user = await User.create({
            username, 
            email, 
            password: hashedPass, 
            role, 
            college,
            isEmailVerified: false
        }); 

        // Generate 6-digit OTP
        const rawOtp = generateOTP();
        const hashedOtp = await bcrypt.hash(rawOtp, 10);

        // Store OTP in MongoDB (expires in 5 minutes)
        await OTP.create({
            email,
            otp: hashedOtp,
            createdAt: new Date(),
            lastSentAt: new Date()
        });

        // Send OTP email via Nodemailer
        try {
            await sendOTPEmail(email, rawOtp);
        } catch (mailErr) {
            console.error("Failed sending OTP email during registration:", mailErr.message);
        }

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(201).json({
            success: true, 
            message: "User Registered Successfully. Please verify your email using the 6-digit OTP sent.",
            user: userObj,
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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        // Find OTP record in MongoDB
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired or is invalid. Please request a new OTP.",
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

        // Update user to verified & delete OTP record
        user.isEmailVerified = true;
        await user.save();

        await OTP.deleteOne({ _id: otpRecord._id });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now log in.",
            user: userObj,
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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found for this email",
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        // Rate limiting check (60 seconds cooldown)
        const existingOTP = await OTP.findOne({ email });
        if (existingOTP && existingOTP.lastSentAt) {
            const timeDiffSeconds = (new Date() - new Date(existingOTP.lastSentAt)) / 1000;
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

        // Upsert OTP document in MongoDB
        await OTP.findOneAndUpdate(
            { email },
            {
                otp: hashedOtp,
                createdAt: new Date(),
                lastSentAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Send OTP email via Nodemailer
        try {
            await sendOTPEmail(email, rawOtp);
        } catch (mailErr) {
            console.error("Failed sending resent OTP email:", mailErr.message);
        }

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
                message: "User not registred",
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