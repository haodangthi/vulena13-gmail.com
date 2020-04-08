const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Truck = require("../../models/truck");
const router = express.Router();

const secret = require("../../config/auth.json").secret;

router.post("/api/trucks", (req, res) => {
  const truck = defineTruckType(req.body.type);
  const user = req.user;
  console.log(truck);
  if (user.role === "driver") {
    saveToDB(createTruck(user._id, truck, req.body.type), res);
  } else {
    res.status(401).json({ status: "Not a driver" });
  }
});

router.get("/api/trucks", (req, res) => {
  const userID = req.user._id;
  Truck.find({ created_by: userID }).then((trucks) =>
    res.status(200).json({ status: "ok", trucks })
  );
});

router.patch("/api/trucks/:id/assign", (req, res) => {
  Truck.findByIdAndUpdate(req.params.id, {
    status: "OL",
  }).then(() =>
    res.status(200).json({ status: "Truck assigned successfully" })
  );
});

function createTruck(driverID, truck, type) {
  return new Truck({
    type: type,
    payload: truck.payload,
    dimension: truck.dimension,
    status: "IS",
    created_by: driverID,
    assigned_to: "",
  });
}

function saveToDB(item, res) {
  item
    .save()
    .then((truck) => {
      console.log("Truck created successfully");
      res.status(200).json({
        status: "Truck created successfully",
        truck,
      });
    })
    .catch((e) => {
      res.status(500).json({ status: e.message });
    });
}

function defineTruckType(type) {
  const sprinter = {
    payload: 1700,
    dimension: {
      width: 300,
      length: 250,
      height: 170,
    },
  };

  const smallStraight = {
    payload: 2500,
    dimension: {
      width: 500,
      length: 250,
      height: 170,
    },
  };

  const largeStraight = {
    payload: 4000,
    dimension: {
      width: 700,
      length: 350,
      height: 200,
    },
  };

  switch (type) {
    case "SPRINTER":
      return sprinter;
    case "SMALL STRAIGHT":
      return smallStraight;
    case "lARGE STRAIGHT":
      return largeStraight;
    default:
      return false;
  }
}

module.exports = router;
