const express = require("express");
const jwt = require("jsonwebtoken");
const router = new express.Router();

const User = require("../models/user");
const auth = require("../middleware/auth");

router.post("/users", async (request, response) => {
  const user = new User(request.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    response.status(201).send({ user, token });
  } catch (e) {
    response.status(400).send(e);
  }
});

router.post("/users/login", async (request, response) => {
  try {
    const user = await User.findByCredentials(
      request.body.email,
      request.body.password
    );

    const token = await user.generateAuthToken();

    response.send({ user, token });
  } catch (e) {
    response.status(400).send();
  }
});

router.get("/users/me", auth, async (request, response) => {
  response.send(request.user);
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
    const user = await User.findById(_id);

    updates.forEach(update => {
      user[update] = _requestBody[update];
    });

    await user.save();

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
