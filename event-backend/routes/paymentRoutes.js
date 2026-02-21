const express = require("express");
const router = express.Router();

const { createOrder } = require("../controllers/payment");

router.post("/createOrder", createOrder);

module.exports = router;