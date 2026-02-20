const express = require('express'); 
const router = express.Router(); 

const {auth} = require("../middleware/authrz"); 

const {createClub} = require("../controllers/club");
const {getAllClubs} = require("../controllers/getClub");  

router.post("/createClub", auth, createClub);
router.get("/getClubs", getAllClubs); 

module.exports = router; 