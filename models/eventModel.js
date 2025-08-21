const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["joined", "present", "absent"],
      default: "joined",
    },
    sectorAtJoin: { type: String }, 
    joinedAt: { type: Date, default: Date.now },
    markedAt: { type: Date }, 
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    day: { type: String },
    month: { type: String },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },

    // ✅ NEW: participants
    participants: { type: [participantSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
