const { model, Schema } = require("mongoose");

const productSchema = new Schema(
{
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  
});

module.exports = model("Product", productSchema);
