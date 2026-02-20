const Event = require("../models/events");
const { uploadFileToCloudinary } = require("../config/cloudinary"); 

// ================= CREATE EVENT =================
exports.createEvent = async (req, res) => {
  try {
    const { title, description, clubId } = req.body;

    // get uploaded file
    const image = req.files.image;

    // upload to cloudinary
    const response = await uploadFileToCloudinary(
      image,
      "eventImages",
      40 // compression quality
    );

    // create event in DB
    const event = await events.create({
      title,
      description,
      image: response.secure_url, // cloudinary URL
      club: clubId,
    });

    res.status(200).json({
      success: true,
      event,
      message: "Event created successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating event",
    });
  }
}; 

// ================= GET CLUB EVENTS =================
exports.getClubEvents = async (req, res) => {
    try {
      const { clubId } = req.params;
  
      const events = await events.find({ club: clubId })
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        events,
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching events",
      });
    }
  };