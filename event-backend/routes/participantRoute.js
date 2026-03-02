const express = require("express");
const router = express.Router();
const { registerParticipant } = require("../controllers/participantController");  

router.post("/participate/:eventId", registerParticipant); 

module.exports = router; 