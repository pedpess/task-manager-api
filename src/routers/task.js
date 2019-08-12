const express = require("express");
const router = new express.Router();

const Task = require("../models/task");

router.post("/tasks", async (request, response) => {
  const task = new Task(request.body);

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
