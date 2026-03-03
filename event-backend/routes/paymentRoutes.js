const express = require("express");
const router = express.Router();

const { createOrder } = require("../controllers/payment");

const { verifyPayment } = require("../controllers/verifyPayment"); 
const { auth } = require("../middleware/authrz");
router.post("/verify-payment", auth, verifyPayment);
router.post("/createOrder", createOrder);

module.exports = router;