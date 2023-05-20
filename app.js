var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");

var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var ordersRouter = require("./routes/orders");
var productsRouter = require("./routes/products");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("trust proxy", 1);
app.enable("trust proxy");

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/orders", ordersRouter);
app.use("/products", productsRouter);

// middleware
app.use(function (err, req, res, next) {
  console.error(err.stack); 
  res.status(500).send('Something broke!'); 
});

// routes that are not defined
app.use(function (req, res, next) {
  res.status(404).send('Sorry, that route does not exist.');
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

module.exports = app;







