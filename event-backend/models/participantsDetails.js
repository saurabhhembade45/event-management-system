const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    // ================= EVENT REFERENCE =================
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    // ================= USER DETAILS =================
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true
    },

    // ================= EVENT RELATED INFO =================
    college: {
      type: String,
      default: ""
    },

    year: {
      type: String,
      enum: [
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "Professional"
      ],
      default: ""
    },

    emergencyContact: {
      type: String,
      default: ""
    },

    requirements: {
      type: String,
      default: ""
    },

    // ================= PAYMENT STATUS =================
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    paymentId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Participant", participantSchema);