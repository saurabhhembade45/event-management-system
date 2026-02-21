const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String, // cloudinary image URL
      required: true,
    },

    // ⭐ NEW FIELDS (for event detail page)
    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    }, 
    registrationFee: {
      type: Number,
      required: true,
      default: 0,
    },

    // ⭐ link event to club
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);