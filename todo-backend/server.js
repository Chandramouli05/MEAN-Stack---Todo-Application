//Importing express.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//using middlewares
const app = express();
app.use(express.json());
app.use(cors());

//Connecting to DB
mongoose
  .connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`DB is connected`);
  })
  .catch((err) => {
    console.log(err);
  });

//Using Schemas

const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    type: String,
  },
});

//todoModel

const todoModel = mongoose.model("Todo", todoSchema);

//Create a new Todo

app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all items

app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Update the item

app.put("/todos/:id", async (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;

  try {
    const updateTodos = await todoModel.findByIdAndUpdate(id, {
      title,
      description,
    });
    if (!updateTodos) {
      return res.status(404).json({ message: "todo item not found" });
    }

    res.json(updateTodos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete the items

app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Connect the Server
const port = 3500;
app.listen(port, () => {
  console.log(`Port is listening : ${port}`);
});
