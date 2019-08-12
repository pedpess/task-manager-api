const express = require("express");
const router = new express.Router();

const User = require("../models/user");

router.post("/users", async (request, response) => {
  const user = new User(request.body);

  try {
    await user.save();
    response.status(201).send(user);
  } catch (e) {
    response.status(400).send(e);
  }
});

router.get("/users", async (request, response) => {
  try {
    const users = await User.find({});
    response.send(users);
  } catch (e) {
    response.status(500).send(e);
  }
});

router.get("/users/:id", async (request, response) => {
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

router.patch("/users/:id", async (request, response) => {
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

router.delete("/users/:id", async (request, response) => {
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

module.exports = router;