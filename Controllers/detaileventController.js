// detaileventController.js

const Detailevent = require("../models/detaileventModel");

// Join an event
const joinEvent = async (req, res) => {
  const { eventId, userId } = req.body;

  try {
    // Find the event by ID
    const event = await Detailevent.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if the user is already a participant
    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: "User has already joined this event" });
    }

    // Add the user to the participants array
    event.participants.push(userId);

    // Save the updated event
    const updatedEvent = await event.save();

    res.status(200).json({ message: "Successfully joined the event", event: updatedEvent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  joinEvent
};
