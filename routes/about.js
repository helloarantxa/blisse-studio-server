const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const AboutForm = require("../models/AboutForm");

// get about Information
router.get("/about", (req, res) => {
  AboutForm.find()
    .then((aboutInfo) => {
      res.status(200).json(aboutInfo);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch about information" });
    });
});

// Submit/Update About Form
router.post("/about", isAuthenticated, (req, res) => {
  const { title, information, image } = req.body;

  AboutForm.findOne()
    .then((aboutInfo) => {
      if (aboutInfo) {

        aboutInfo.title = title;
        aboutInfo.information = information;
        aboutInfo.image = image;

        aboutInfo
          .save()
          .then((updatedAboutInfo) => {
            res.status(200).json(updatedAboutInfo);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Failed to update about information" });
          });
          
      } else {

        // creates new about information
        const newAboutInfo = new AboutForm({
          title,
          information,
          image,
        });

        newAboutInfo
          .save()
          .then((createdAboutInfo) => {
            res.status(201).json(createdAboutInfo);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Failed to create about information" });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to fetch about information" });
    });
});

//

module.exports = router;