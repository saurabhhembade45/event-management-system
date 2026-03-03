const crypto = require("crypto");
const Participant = require("../models/participantsDetails");

exports.verifyPayment = async (req, res) => {
  try {

    // 🔥 IMPORTANT: take everything except razorpay fields
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      ...participantDetails
    } = req.body;

    // 🔐 Step 1 — Verify Razorpay Signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // ✅ Step 2 — Save participant ONLY after successful payment
    const participant = await Participant.create({
      user: req.user.id,
      event: eventId,
      ...participantDetails,   // 🔥 name, email, phone, etc
      paymentStatus: "paid",
      paymentId: razorpay_payment_id
    });

    res.status(200).json({
      success: true,
      message: "Payment successful",
      participant
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};