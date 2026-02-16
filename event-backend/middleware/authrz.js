const jwt = require("jsonwebtoken"); 

exports.auth = async (req,res, next) => {
    try {
        // get token
        const token =
        req.header("Authorization")?.replace("Bearer ", ""); 

     // token missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            req.user = decoded; 
        }
        catch(err) {
            return res.status(401).json({
                success : false,
                message : "Token Invalid", 
            })
        }
        // very important 
        next();  // move to the next route 
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Authorization failed",
        }); 
    }
}