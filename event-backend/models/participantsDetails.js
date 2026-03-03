const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    // ================= USER REFERENCE =================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ================= EVENT REFERENCE =================
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    // ================= PARTICIPANT SNAPSHOT DETAILS =================
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    college: {
      type: String,
      default: "",
      trim: true
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
      default: null   // ✅ FIXED (no empty string)
    },

    emergencyContact: {
      type: String,
      default: "",
      trim: true
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


// ================= PREVENT DUPLICATE REGISTRATION =================
// One user cannot register for same event twice
participantSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Participant", participantSchema);