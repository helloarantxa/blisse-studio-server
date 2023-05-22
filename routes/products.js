var express = require('express');
var router = express.Router();
const Product = require('../models/Product');

router.post('/new-product', (req, res) => {
  console.log('line7')
  const { name, description, price, imageUrl } = req.body;

  Product.create({
    name,
    description,
    price,
    imageUrl,
  })
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Failed to create product' });
    });
});

// Get All Products
router.get('/all-products', (req, res) => {
  Product.find()
    .populate('owner')
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Failed to fetch products' });
    });
});

module.exports = router;