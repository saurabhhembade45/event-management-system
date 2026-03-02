const Participant = require("../models/participantsDetails"); 

exports.registerParticipant = async (req, res) => {
  try {
    const { eventId } = req.params; 

    const participant = await Participant.create({
      event: eventId,
      ...req.body
    });

    res.status(201).json({
      success: true,
      participant
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};