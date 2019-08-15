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

router.get("/tasks", auth, async (request, response) => {
  try {
    await request.user.populate("tasks").execPopulate();
    response.send(request.user.tasks);
  } catch (e) {
    response.status(500).send(e);
  }
});

router.get("/tasks/:id", auth, async (request, response) => {
  const _id = request.params.id;

  try {
    const task = await Task.findOne({ _id, owner: request.user._id });

    if (!task) {
      return response.status(404).send();
    }

    response.send(task);
  } catch (e) {
    response.status(500).send(e);
  }
});

router.patch("/tasks/:id", auth, async (request, response) => {
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
    const task = await Task.findOne({ _id, owner: request.user._id });

    if (!task) {
      return response.status(404).send();
    }

    updates.forEach(update => {
      task[update] = _requestBody[update];
    });

    await task.save();

    response.send(task);
  } catch (e) {
    response.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (request, response) => {
  const _id = request.params.id;

  try {
    const task = await Task.findOneAndDelete({
      _id,
      owner: request.user._id
    });

    if (!task) {
      return response.status(404).send();
    }

    response.send(task);
  } catch (e) {
    response.status(500).send(e);
  }
});

module.exports = router;
