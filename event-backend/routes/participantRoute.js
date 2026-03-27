const express = require("express");
const router = express.Router();

const {getMyParticipations} = require("../controllers/getParticipants");
const { auth } = require("../middleware/authrz"); 
const { checkParticipation } = require("../controllers/participantCheck"); 
const { getParticipantCount } = require("../controllers/getParticipants"); 

router.get("/count/:eventId", getParticipantCount);
router.get("/my", auth, getMyParticipations);
router.get("/check/:eventId", auth, checkParticipation);   

module.exports = router; 