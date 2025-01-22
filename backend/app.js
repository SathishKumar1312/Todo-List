const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Middleware to wait for DB connection before proceeding
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Mongoose DB Connected Successfully!");
      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Database connection error" });
    }
  } else {
    next();
  }
});

// Schema creation
const todoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
  },
  {
    minimize: true,
    versionKey: false,
  }
);

// Model creation
const todoModel = mongoose.model("todo", todoSchema);

app.get('/',(req,res)=>{
    res.send('Hello World!')
})

// Routes
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  try {
    const todo = new todoModel({ title, description });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving the todo" });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const docs = await todoModel.find();
    res.json(docs);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error retrieving todos" });
  }
});

app.put("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  try {
    await todoModel.findByIdAndUpdate(id, { title, description });
    res.json({ message: "Update successful" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error updating the todo" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await todoModel.deleteOne({ _id: id });
    res.json({ message: "Delete successful" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error deleting the todo" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
