const express = require('express'); 
const router = express.Router(); 

const { register, login, verifyOTP, resendOTP } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

const { auth } = require("../middleware/authrz");

router.get("/dashboard", auth, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to protected route",
        user: req.user
    });
});

module.exports = router;
