const express = require("express");
require("./db/mongoose");

const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", async (request, response) => {
  const user = new User(request.body);

  try {
    await user.save();
    response.status(201).send(user);
  } catch (e) {
    response.status(400).send(e);
  }
});

app.get("/users", async (request, response) => {
  try {
    const users = await User.find({});
    response.send(users);
  } catch (e) {
    response.status(500).send(e);
  }
});

app.get("/users/:id", async (request, response) => {
  const _id = request.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return response.status(404).send();
    }

    response.send(user);
  } catch (e) {
    response.status(500).send(e);
  }
});

app.post("/tasks", async (request, response) => {
  const task = new Task(request.body);

  try {
    await task.save();
    response.status(201).send(task);
  } catch (e) {
    response.status(400).send(e);
  }
});

app.get("/tasks", async (request, response) => {
  try {
    const tasks = await Task.find({});
    response.send(tasks);
  } catch (e) {
    response.status(500).send(e);
  }
});

app.get("/tasks/:id", async (request, response) => {
  const _id = request.params.id;

  try {
    const task = await Task.findById(_id);

    if (!task) {
      return response.status(404).send();
    }

    response.send(task);
  } catch (e) {
    response.status(500).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});
