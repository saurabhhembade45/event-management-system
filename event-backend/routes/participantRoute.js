const express = require("express");
const router = express.Router();

const {getMyParticipations} = require("../controllers/getParticipants");
const { auth } = require("../middleware/authrz"); 

router.get("/my", auth, getMyParticipations);

module.exports = router; 