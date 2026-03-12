const express = require("express");
const router = express.Router();

const {getMyParticipations} = require("../controllers/getParticipants");
const { auth } = require("../middleware/authrz"); 
const { checkParticipation } = require("../controllers/participantCheck");  

router.get("/my", auth, getMyParticipations);
router.get("/check/:eventId", auth, checkParticipation);   

module.exports = router; 