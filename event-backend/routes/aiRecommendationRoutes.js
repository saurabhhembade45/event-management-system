const express = require("express");
const router = express.Router();

const { getAIRecommendations } = require("../controllers/aiRecommendation");
const { auth } = require("../middleware/authrz");

router.get("/recommendations", auth, getAIRecommendations);

module.exports = router;