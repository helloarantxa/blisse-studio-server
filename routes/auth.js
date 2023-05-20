var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var User = require("../models/User");

var router = express.Router();
var saltRounds = 10;

const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;
console.log(req.body)
  // Check if the email or password or name is provided as an empty string
  if (email === "" || password === "" || username === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If the email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      console.log('password',password,'hashed', hashedPassword)
      // Create a new user in the database
      // We return a pending promise, which allows us to chain another `then`
      User.create({ email, passwordHash: hashedPassword, username }).then(
        (user) => {
          // Deconstruct the newly created user object to omit the password
          // We should never expose passwords publicly
          const { email, username, _id } = user;

          // Create a new object that doesn't expose the password
          const userData = { email, username, _id };

          // Send a JSON response containing the user object
          res.status(201).json({ user: userData });
        }
      );
    })

    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
    console.log(req.body)
  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }
  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.passwordHash);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, username } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, username };

        // Create and sign the token
        const authToken = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })});
});

// GET  /auth/verify
// ...

router.get("/verify", isAuthenticated, (req, res, next) => {
  // <== CREATE NEW ROUTE

  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log("req.payload", req.user);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.user);
});

module.exports = router;
