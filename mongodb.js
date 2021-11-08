const express = require("express");
const mongoose = require("mongoose");

const User = require("./src/db/mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      throw new Error("No users found");
    }
    res.status(200).send(users);
  } catch (e) {
    res.status(400).send();
  }
});

app.post("/users", async (req, res) => {
  const me = new User(req.body);

  try {
    const user = await me.save();
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send();
  }
});

app.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "username"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

app.listen(3000, () => {
  console.log("Port is running on 3000");
});
