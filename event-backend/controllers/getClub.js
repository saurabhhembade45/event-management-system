const Club = require("../models/clubs"); 

// ================= GET ALL CLUBS =================
exports.getAllClubs = async (req, res) => {
    try {
      const clubs = await Club.find().sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        clubs,
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching clubs",
      });
    }
  };
  