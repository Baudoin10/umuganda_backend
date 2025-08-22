
const Event = require("../models/eventModel");
const User = require("../models/userModel");

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
    const { day, month } = computeLabels(date);
    const newEvent = new Event({
      title,
      description,
      address,
      date,
      day,
      month,
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
    // You can also project counts if you want:
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Join an event (user)
const joinEvent = async (req, res) => {
  const { eventId, userId } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.status === "Closed") {
      return res.status(400).json({ message: "This event is closed" });
    }

    // Check if already joined
    const already = event.participants.find(
      (p) => String(p.user) === String(userId)
    );
    if (already) {
      return res
        .status(400)
        .json({ message: "User has already joined this event" });
    }

    // Snapshot sector at join
    const user = await User.findById(userId).lean();
    const sectorAtJoin = user?.sector || null;

    event.participants.push({
      user: userId,
      status: "joined",
      sectorAtJoin,
      joinedAt: new Date(),
    });

    const updated = await event.save();
    res
      .status(200)
      .json({ message: "Successfully joined the event", event: updated });
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

/* ============================
   NEW: Participation endpoints
   ============================ */

// Admin: list participants with filters + pagination
  // Admin: list participants with filters + pagination
const getParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { q = "", status, sector, page = 1, limit = 10 } = req.query;

    // populate user so we can return name/email
    const event = await Event.findById(eventId)
      .populate("participants.user", "firstname lastname email sector")
      .lean();

    if (!event) return res.status(404).json({ message: "Event not found" });

    // flatten and normalize
    let rows = event.participants.map((p) => {
      const name =
        (p.user?.firstname ? `${p.user.firstname} ${p.user.lastname || ""}`.trim() : "Unknown");
      const sectorNorm = (p.sectorAtJoin || p.user?.sector || "-")?.trim();
      return {
        _id: String(p.user?._id || p.user),
        name,
        sector: sectorNorm,
        status: p.status,
        joinedAt: p.joinedAt,
        email: p.user?.email || "",
      };
    });

    // filters
    if (status) rows = rows.filter((r) => r.status === status);
    if (sector) rows = rows.filter((r) => r.sector === sector.trim());
    if (q) {
      const ql = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(ql) ||
          r.email.toLowerCase().includes(ql)
      );
    }

    // pagination
    const total = rows.length;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.max(parseInt(limit, 10) || 10, 1);
    const start = (pageNum - 1) * pageSize;
    const data = rows.slice(start, start + pageSize);

    return res.json({ total, page: pageNum, limit: pageSize, data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// Admin: update participant status (present/absent)
const updateParticipantStatus = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const { status } = req.body; // "present" | "absent"
    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const participant = event.participants.find(
      (p) => String(p.user) === String(userId)
    );
    if (!participant) {
      return res
        .status(404)
        .json({ message: "Participant not found for this event" });
    }

    participant.status = status;
    participant.markedAt = new Date();

    await event.save();
    res.json({ message: "Status updated", userId, status });
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
  getParticipants,
  updateParticipantStatus,
};
