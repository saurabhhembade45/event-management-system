const Participant = require("../models/participantsDetails"); 

exports.checkParticipation = async (req, res) => {
  try {

    const userId = req.user.id;
    const { eventId } = req.params;

    const participant = await Participant.findOne({
      user: userId,
      event: eventId
    });

    if (participant) {
      return res.json({
        participated: true
      });
    }

    res.json({
      participated: false
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};