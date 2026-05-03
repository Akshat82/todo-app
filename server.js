const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/todoDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ✅ Updated Schema (added completed field)
const Task = mongoose.model("Task", {
  text: String,
  completed: {
    type: Boolean,
    default: false
  }
});


// ✅ CREATE (Add Task)
app.post("/add", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.json({ message: "Empty task ignored" });
    }

    const task = new Task({ text });
    await task.save();

    res.json({ message: "Task added" });
  } catch (err) {
    console.log(err);
    res.json({ message: "Error handled" });
  }
});


// ✅ READ (Get All Tasks)
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.json([]);
  }
});


// ✅ UPDATE TASK (Edit text or mark complete)
app.put("/update/:id", async (req, res) => {
  try {
    const { text, completed } = req.body;

    await Task.findByIdAndUpdate(req.params.id, {
      text,
      completed
    });

    res.json({ message: "Task updated" });
  } catch (err) {
    console.log(err);
    res.json({ message: "Update failed" });
  }
});


// ✅ DELETE TASK
app.delete("/delete/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.log(err);
    res.json({ message: "Delete failed" });
  }
});


// Server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});