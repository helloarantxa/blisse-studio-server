const mongoose = require("mongoose");

const aboutFormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  information: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const AboutForm = mongoose.model("AboutForm", aboutFormSchema);

module.exports = AboutForm;