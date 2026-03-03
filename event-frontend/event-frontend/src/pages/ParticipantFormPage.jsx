const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    // ===== Logged-in User =====
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ===== Event Reference =====
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // ===== Event-Specific Details =====
    year: {
      type: String,
      enum: [
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "Professional",
      ],
    },

    emergencyContact: {
      type: String,
    },

    requirements: {
      type: String,
    },

    // ===== Payment Info =====
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ⭐ Prevent duplicate registration for same event
participantSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Participant", participantSchema);