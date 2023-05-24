const express = require("express");
const router = express.Router();
const ConnectForm = require("../models/ConnectForm");
const User = require("../models/User");

// Create new form
router.post("/connectCard", (req, res) => {
  const {
    email,
    fullName,
    phoneNumber,
    projectDate,
    location,
    projectType,
    projectDescription,
  } = req.body;

  ConnectForm.create({
    email,
    fullName,
    phoneNumber,
    projectDate,
    location,
    projectType,
    projectDescription,
  })
    .then((createdForm) => {
      console.log(createdForm);

      User.findOneAndUpdate(
        { isAdmin: true },
        { $push: { connectCards: createdForm._id } },
        { new: true }
      ).then((response) => {
        console.log(response);
      });

      res.status(201).json(createdForm);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to create form submission" });
    });
});
router.get("/connectCards", (req, res) => {
  User.findOne({ isAdmin: true })
    .populate("connectCards")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user.connectCards);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch connect cards" });
    });
});

module.exports = router;
