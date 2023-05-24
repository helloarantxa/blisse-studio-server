const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


// Create a new product
router.post('/new-product', (req, res) => {

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


// Get all products
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

// Get product details by ID
router.get('/product-details/:id', (req, res) => {
  const { id } = req.params;

  Product.findById(id)
    .then((product) => {
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.status(200).json(product);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Failed to fetch product details' });
    });
});

// Update a product by ID
router.post('/edit-product/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, imageUrl } = req.body;

  Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      price,
      imageUrl,
    },
    { new: true }
  )
    .then((updatedProduct) => {
      console.log(updatedProduct);

      if (!updatedProduct) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.status(200).json(updatedProduct);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Failed to update product' });
    });
});


// Delete a product by ID
router.get('/delete-product/:id', (req, res) => {
  const { id } = req.params;

  Product.findByIdAndRemove(id)
    .then(() => {
      res.status(200).json({ message: 'Product deleted' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Failed to delete product' });
    });
});

module.exports = router;