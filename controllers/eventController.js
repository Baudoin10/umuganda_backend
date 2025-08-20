

const Event = require("../models/eventModel");

// helper: compute day/month from "YYYY-MM-DD"
function computeLabels(dateISO) {
  const d = new Date(`${dateISO}T00:00:00`);
  const day = d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase(); 
  const month = d.toLocaleDateString("en-US", { month: "long" }); 
  return { day, month };
}

// Create a new event
const createEvent = async (req, res) => {
  const { title, description, address, date, status } = req.body;

  try {
    // compute labels from date
    const { day, month } = computeLabels(date);

    const newEvent = new Event({
      title,
      description,
      address,
      date, // "YYYY-MM-DD"
      day, // computed
      month, // computed
      status: status || "Open",
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all events
const getEvents = async (_req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Join an event
const joinEvent = async (req, res) => {
  const { eventId, userId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.status === "Closed") {
      return res.status(400).json({ message: "This event is closed" });
    }

    if (!event.participants) event.participants = [];
    if (event.participants.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User has already joined this event" });
    }

    event.participants.push(userId);
    const updatedEvent = await event.save();

    res
      .status(200)
      .json({ message: "Successfully joined the event", event: updatedEvent });
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

    if (req.body.title !== undefined) event.title = req.body.title;
    if (req.body.description !== undefined)
      event.description = req.body.description;
    if (req.body.address !== undefined) event.address = req.body.address;

    if (req.body.date !== undefined) {
      event.date = req.body.date;
      const { day, month } = computeLabels(req.body.date);
      event.day = day;
      event.month = month;
    }

    if (req.body.status !== undefined) event.status = req.body.status;

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
  joinEvent,
};
