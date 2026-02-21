const Event = require("../models/events");
const { uploadFileToCloudinary } = require("../controllers/fileUpload");

// ================= CREATE EVENT =================
exports.createEvent = async (req, res) => {
  try {
    // ✅ get all fields from frontend
    const {
      title,
      description,
      clubId,
      date,
      time,
      location, 
      registrationFee,
    } = req.body;

    // get uploaded file
    const image = req.files.image;

    // upload image to cloudinary
    const response = await uploadFileToCloudinary(
      image,
      "eventImages",
      40 // compression quality
    );

    // ✅ create event in DB with new fields
    const event = await Event.create({
      title,
      description,
      image: response.secure_url,
      club: clubId,
      date,
      time,
      location, 
      registrationFee, 
    });

    res.status(200).json({
      success: true,
      event,
      message: "Event created successfully",
    });

  } catch (error) {
    console.log("CREATE EVENT ERROR:", error);
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

    // ✅ fetch events of specific club
    const events = await Event.find({ club: clubId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      events,
    });

  } catch (error) {
    console.log("FETCH EVENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching events",
    });
  }
};

// ================= GET SINGLE EVENT =================
exports.getSingleEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate("club", "name");

    res.status(200).json({
      success: true,
      event,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching event",
    });
  }
};