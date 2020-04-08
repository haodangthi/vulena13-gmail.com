const express = require("express");
const mongoose = require("mongoose");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/api/auth/register", (req, res) => {
  return findByEmail(req.body.username).then((user) => {
    if (!user) {
      createUser(req, res);
    } else {
      res.status(401).json({status:"There is a user with the same username"})
    }
  });
});

function createUserDB(username, password, role) {
  return new User({
    username: username,
    password: password,
    role: role,
  });
}

function saveUserToDB(user, res) {
  user
    .save()
    .then(() => {
      res.status(200).json({
        status: "User registered successfully",
        user,
      });
    })
    .catch((e) => {
      res.status(500).json({ status: e.message });
    });
}

function createUser(req, res) {
  console.log("creating a user");

  const user = createUserDB(
    req.body.username,
    req.body.password,
    req.body.role
  );
  saveUserToDB(user, res);
}

function findByEmail(username) {
  return User.findOne({ username: username })
    .then((res) => res)
    .catch((e) => {
      console.log("User is not found");
      res.status(401).json();
    });
}

module.exports = router;
