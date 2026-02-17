const express = require('express'); 
const router = express.Router(); 

const {auth} = require("../middleware/authrz"); 

const {createClub} = require("../controllers/club");

router.post("/createClub", auth, createClub);

module.exports = router; 