const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/authrz");
const {
  createEvent,
  getClubEvents, getSingleEvent, deleteEvent
} = require("../controllers/event");

// create event (protected)
router.post("/createEvent", auth, createEvent);

// get events of club
router.get("/club/:clubId", getClubEvents);

router.get("/:eventId", getSingleEvent);

router.delete("/deleteEvent/:id", auth, deleteEvent); 

module.exports = router;