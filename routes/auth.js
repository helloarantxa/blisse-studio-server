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

  
  if (email === "" || password === "" || username === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {

      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      console.log('password',password,'hashed', hashedPassword)
      
      User.create({ email, passwordHash: hashedPassword, username }).then(
        (user) => {
        
          const { email, username, _id } = user;

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

      const passwordCorrect = bcrypt.compareSync(password, foundUser.passwordHash);

      if (passwordCorrect) {

        const { _id, email, username, isAdmin } = foundUser;

        const payload = { _id, email, username, isAdmin };

        const authToken = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.status(200).json({ authToken: authToken, user: payload });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })});
});

// GET  /auth/verify

router.get("/verify", isAuthenticated, (req, res, next) => {


  console.log("req.payload", req.user);


  res.status(200).json(req.user);
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.redirect('/');
  });
});

// ... existing code ...

module.exports = router;
