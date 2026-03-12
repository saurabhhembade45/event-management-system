const express = require('express'); 
const router = express.Router(); 

const {auth} = require("../middleware/authrz"); 

const {createClub, deleteClub} = require("../controllers/club");
const {getAllClubs} = require("../controllers/getClub");  


router.post("/createClub", auth, createClub);
router.get("/getClubs", getAllClubs); 
router.delete("/deleteClub/:id", auth, deleteClub); 

module.exports = router; 