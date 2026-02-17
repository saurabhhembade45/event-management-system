const Club = require("../models/clubs");

// ================= CREATE CLUB =================
exports.createClub = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    // user comes from auth middleware
    const userId = req.user.id;

    const club = await Club.create({
      name,
      description,
      image,
      createdBy: userId, 
    });

    res.status(200).json({
      success: true,
      message: "Club created successfully",
      club,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating club",
    });
  }
};
