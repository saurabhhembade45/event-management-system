const Participant = require("../models/participantsDetails");  

exports.getMyParticipations = async (req, res) => {
    try {
      const participations = await Participant.find({
        user: req.user.id
      }).populate("event");
  
      res.status(200).json({
        success: true,
        participations
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch" });
    }
  };