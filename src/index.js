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

app.patch("/users/:id", async (request, response) => {
  const _id = request.params.id;
  const _requestBody = request.body;

  const allowedUpdates = ["name", "email", "password", "age"];
  const updates = Object.keys(_requestBody);
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return response.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findByIdAndUpdate(_id, _requestBody, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return response.status(404).send();
    }

    response.send(user);
  } catch (e) {
    response.status(400).send(e);
  }
});

app.delete("/users/:id", async (request, response) => {
  const _id = request.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);

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

app.patch("/tasks/:id", async (request, response) => {
  const _id = request.params.id;
  const _requestBody = request.body;

  const allowedUpdates = ["description", "completed"];
  const updates = Object.keys(_requestBody);
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return response.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const task = await Task.findByIdAndUpdate(_id, _requestBody, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return response.status(404).send();
    }

    response.send(task);
  } catch (e) {
    response.status(400).send(e);
  }
});

app.delete("/tasks/:id", async (request, response) => {
  const _id = request.params.id;

  try {
    const task = await Task.findByIdAndDelete(_id);

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
