const razorpay = require("../config/razorpay");
const Event = require("../models/events");

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const options = {
      amount: event.registrationFee * 100, // paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      event,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};