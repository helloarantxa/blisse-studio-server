const express = require("express");
const router = express.Router();
const ConnectForm = require("../models/ConnectForm");
const User = require("../models/User");
const isAuthenticated = require("../middleware/isAuthenticated");

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

//DELETE CARD 
router.post("/delete-card/:cardId", isAuthenticated, (req, res) => {
  const cardId = req.params.cardId;

  ConnectForm.findByIdAndDelete(cardId)
    .then(() => {
      res.status(200).json({ message: "Connect card deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to delete connect card" });
    });
});


router.get("/connectCards", isAuthenticated, (req, res) => {
  console.log(req.user);
  

  User.findOne({ isAdmin: true })
    .populate("connectCards")
    .then((user) => {
     
      if (req.user.isAdmin === true)
      
      {res.status(200).json(user.connectCards)};
    })
    
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch connect cards" });
    });
});

module.exports = router;
