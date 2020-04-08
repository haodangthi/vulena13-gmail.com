const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Load = require("../../models/load");
const Truck = require("../../models/truck");
const router = express.Router();

const secret = require("../../config/auth.json").secret;

router.patch("/api/loads/:id/post", (req, res) => {
  if (req.user.role === "shipper") {
    const truckId = 0;
    Truck.find({ status: "OL", assigned_to: "" }).then((trucks) => {
      Load.findById(req.params.id).then((load) => {
        const truck = findTruck(trucks, load)[0];
        console.log(findTruck(trucks, load));

        Load.findByIdAndUpdate(req.params.id, {
          assigned_to: truck.created_by,
        }).then((load) => {
          Truck.findByIdAndUpdate(truck._id, {
            assigned_to: load._id,
          }).then((truck) =>
            res.status(200).json({
              status: "Load posted successfully",
              assigned_to: truck.created_by,
            })
          );
        });
      });
    });
  }
});

function findTruck(trucks, load) {
  return trucks.filter((truck) => {
    return compareDimension(load, truck);
  });
}

function compareDimension(load, truck) {
  // for (let prop in load.dimension){
  //   if( load.dimension.prop>truck.dimention.prop ){return false}
  // }
  return (
    load.payload < truck.payload &&
    load.dimension.width < truck.dimension.width &&
    load.dimension.height < truck.dimension.height &&
    load.dimension.length < truck.dimension.length
  );
}

router.get("/api/loads", (req, res) => {
  if (req.user.role === "driver") {
    Load.find({ assigned_to: req.user._id }).then((loads) => {
      res.json({ status: "Success", loads });
    });
  } else if (req.user.role === "shipper") {
    Load.find({ created_by: req.user._id }).then((loads) =>
      res.status(200).json({ status: "Success", loads })
    );
  }
});

router.post("/api/loads", (req, res) => {
  console.log(req.body.dimensions.payload);
  console.log(typeof req.body.dimensions.payload);
  if (req.user.role === "shipper") {
    let date = new Date();
    date = date.toLocaleDateString();

    saveToDB(
      createLoad(
        req.user._id,
        req.body.dimensions.width,
        req.body.dimensions.length,
        req.body.dimensions.height,
        req.body.payload,
        date
      ),
      res
    );
  }
});

router.patch("/api/loads/:id/state", (req, res) => {
  Load.findById(req.params.id).then((load) => {
    const newState = defineState(load.state);

    Load.findByIdAndUpdate(req.params.id, {
      state: newState[0],
      status: newState[1],
    }).then((load) =>
      res.status(200).json({ status: "Load status changed successfully", load })
    );
  });
});

function createLoad(shipperID, width, length, height, payload, time) {
  return new Load({
    payload: payload,
    dimension: { width, length, height },
    status: "New",
    state: "",
    created_by: shipperID,
    assigned_to: "",
    logs: [{ message: "Load created", time }],
  });
}

function saveToDB(item, res) {
  item
    .save()
    .then((load) => {
      console.log("load's been created");
      res.status(200).json({
        status: "Load created successfully",
        load,
      });
    })
    .catch((e) => {
      res.status(500).json({ status: e.message });
    });
}

function defineState(oldState) {
  switch (oldState) {
    case "En route to pick up":
      return ["Arrived to pick up", "Assigned"];
    case "Arrived to pick up":
      return ["On route to delivery", "Assigned"];
    case "On route to delivery":
      return ["Arrived to delivery", "Shipped"];
    case "Arrived to delivery":
      return ["Arrived to delivery", "Shipped"];
    case "":
      return ["En route to pick up", "Assigned"];
    default:
      return ["En route to pick up", "Assigned"];
  }
}

module.exports = router;
