var express = require('express');
var router = express.Router();

const Order = require('../models/Order')

// Create an order
router.post('/', async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
