const Task = require("../models/taskModel");

// Search task
const searchtask = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(query, "i");
    const tasks = await Task.find({
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { address: { $regex: searchRegex } },
        { day: { $regex: searchRegex } },
        { month: { $regex: searchRegex } },
      ],
    });

    res.json({ success: true, tasks });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { searchtask };
