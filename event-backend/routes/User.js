const express = require('express'); 
const router = express.Router(); 
 

const {register, login} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);

const { auth } = require("../middleware/authrz");

router.get("/dashboard", auth, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to protected route",
        user: req.user
    });
});


module.exports = router; 
