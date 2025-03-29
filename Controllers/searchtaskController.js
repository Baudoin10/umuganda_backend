const Task = require("../models/taskModel");

// Search Tasks
const searchTasks = async (req, res) => {
  try {
    const { query } = req.query; // Get search query from query parameters

    // Check if query is provided
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Create a case-insensitive regex for searching
    const searchRegex = new RegExp(query, "i");

    // Find tasks that match the query in title or description
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

module.exports = { searchTasks };
