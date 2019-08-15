const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");

const Task = require("../models/task");

router.post("/tasks", auth, async (request, response) => {

  const task = new Task({
    ...request.body,
    owner: request.user._id
  });

  try {
    await task.save();
    response.status(201).send(task);
  } catch (e) {
    response.status(400).send(e);
  }
});

router.get("/tasks", async (request, response) => {
  try {
    const tasks = await Task.find({});
    response.send(tasks);
  } catch (e) {
    response.status(500).send(e);
  }
});

router.get("/tasks/:id", async (request, response) => {
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

router.patch("/tasks/:id", async (request, response) => {
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
    const task = await Task.findById(_id);

    updates.forEach(update => {
      task[update] = _requestBody[update];
    });

    await task.save();

    if (!task) {
      return response.status(404).send();
    }

    response.send(task);
  } catch (e) {
    response.status(400).send(e);
  }
});

router.delete("/tasks/:id", async (request, response) => {
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

module.exports = router;
