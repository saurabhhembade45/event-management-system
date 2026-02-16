const User = require("../models/user");
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 

exports.register = async(req,res) => {
    try {
        const {username, email, password, role, college} = req.body;  

        const existingUser = await User.findOne({email}); 
        
        if (existingUser) {
            return res.status(400).json({
                succes : false,
                message : "user already exists for this mail",
            }); 
        }
        const hashedPass = await bcrypt.hash(password, 10); 

        // create User 
        const user = await User.create({
            username, 
            email, 
            password: hashedPass, 
            role, 
            college
        }); 
        res.status(200).json({
            success : true, 
            message : "User Registered Successfully",
            user,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Registration failed",
        }); 
    }
} 

exports.login = async(req,res) => {
    try {
        const {email, password} = req.body; 

        //validation 
        if (!email || !password) {
            return res.status(400).json({
                success : false,
                message : "Please provide email and password",
            }); 
        }

        // check user exists; 
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({
                succes : false,
                message : "User not registred",
            })
        }

        // compare password ; 
        const isPasswordMatch = await bcrypt.compare(password,user.password); 
        
        if (!isPasswordMatch) {
            return res.status(401).json({
                success : false,
                message : "Incorrect password for this mail",
            }); 
        }
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        }; 
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });
        user.password = undefined; 

    
        res.status(200).json({
            success: true,
            token,
            user,
            message : "login Successfull" , 
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Registration failed",
        }); 
    }
}