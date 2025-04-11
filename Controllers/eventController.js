const Event = require("../models/eventModel");

// Create a new event
const createEvent = async (req, res) => {
  const { title, description, address, date, day, month,status } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      address,
      date,
      day,
      month,
      status: status || 'Open',
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllEvents = async (req, res) => {
  try {
    const events = await Detailevent.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Join an event 
const joinEvent = async (req, res) => {
  const { eventId, userId } = req.body;

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.participants) {
      event.participants = [];
    }
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

// Get a single event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.address = req.body.address || event.address;
    event.date = req.body.date || event.date;
    event.day = req.body.day || event.day;
    event.month = req.body.month || event.month;
    event.status = req.body.status || event.status;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEvents,
  joinEvent,
};
