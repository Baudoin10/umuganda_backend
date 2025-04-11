
const Detailevent = require("../models/detaileventModel");
const createEvent = async (req, res) => {
  const { title, description, address, date } = req.body;

  try {
    if (!title || !description || !address || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const dateParts = date.split('/');
    if (dateParts.length !== 3) {
      return res.status(400).json({ message: "Invalid date format. Please use MM/DD/YYYY" });
    }
    
    const month = dateParts[0];
    const day = dateParts[1];
    
    // Create new event
    const newEvent = new Detailevent({
      title,
      description,
      address,
      date,
      day,
      month,
      participants: [] 
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({ 
      message: "Event created successfully", 
      event: savedEvent 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const joinEvent = async (req, res) => {
  const { eventId, userId } = req.body;

  try {
    const event = await Detailevent.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: "User has already joined this event" });
    }
    event.participants.push(userId);
    const updatedEvent = await event.save();

    res.status(200).json({ message: "Successfully joined the event", event: updatedEvent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createEvent,
  joinEvent
};