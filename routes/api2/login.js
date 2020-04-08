const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const secret = require("../../config/auth.json").secret;
const router = express.Router();

router.post("/api/auth/login", (req, res) => {
  findUser(req.body.username, req.body.password).then((user) => {
    if (!user) {
      console.log("No user");
      res.status(401).json({ status: "User not found" });
    } else {
      console.log(user);
      const jwt_token = jwt.sign(JSON.stringify(user), secret);
      res
        .status(200)
        .json({ status: "User authenticated successfully", jwt_token });
    }
  });
});

function findUser(username, password) {
  return User.findOne({ username: username, password: password });
}

module.exports = router;
