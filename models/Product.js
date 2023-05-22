const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required."],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
    min: [0, "Price cannot be negative."],
  },
  imageUrl: {
    type: String,
    required: [true, "Image is required."],
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }]
});

module.exports = model("Product", productSchema);
