const mongoose = require('mongoose');

const connectFormSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  projectDate: {
    type: String
  },
  location: {
    type: String
  },
  projectType: {
    type: String,
    required: true
  },
  projectDescription: {
    type: String
  }
});

const ConnectForm = mongoose.model('ConnectForm', connectFormSchema);

module.exports = ConnectForm;