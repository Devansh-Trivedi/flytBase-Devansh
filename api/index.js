const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");

const Mission = require("./models/Mission");
const Site = require("./models/Site");
const Categories = require("./models/Categories");
const Drone = require("./models/Drone");

const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));


mongoose.set("strictQuery", false);
// mongoose.connect(process.env.MONGO_URI, () => {
//   console.log("Connected to MongoDB");
// });

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("mongdb is connected");
  }
);


app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // console.log();
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
        token: token,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// Creating mission:
app.post(
  "/createMission",
  uploadMiddleware.single("file"),
  async (req, res) => {
    const { alt, speed, name, waypoints, created_at, updated_at } = req.body;
    // console.log("alt " + alt);
    // console.log("speed " + speed);
    // console.log("name " + name);
    // console.log("waypoints " + waypoints);
    // console.log("created_at " + created_at);
    // console.log("updated_at " + updated_at);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      try {
        const mission = await Mission.create({
          alt,
          speed,
          name,
          waypoints,
          created_at,
          updated_at,
          author: info.id,
        });
        res.json(mission);
        console.log(mission);
      } catch (e) {
        console.log(e);
        res.status(400).json(e);
      }
    });
  }
);

// Updating mission:
app.put("/updateMission", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, alt, speed, name, waypoints, created_at, updated_at } =
      req.body;
    const missionDoc = await Mission.findById(id);
    if (!missionDoc) return res.json("No mission with this mission id.");
    await missionDoc.update({
      alt,
      speed,
      name,
      waypoints,
      created_at,
      updated_at,
      author: info.id,
    });

    res.json({ msg: "Data Updated Successfully", date: req.body });
  });
});

// Delete Mission:
app.put("/deleteMission", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id } = req.body;
    const missionDoc = await Mission.findById(id);
    if (!missionDoc) return res.json("No mission with this mission id.");

    await missionDoc.remove({});

    return res.json({ msg: "Data Deleted Successfully" });
  });
});

// Create Site
app.post("/createSite", uploadMiddleware.single("file"), async (req, res) => {
  const { site_name, position } = req.body;
  // console.log(req.body);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    try {
      const site = await Site.create({
        site_name,
        position,
        author: info.id,
      });
      res.json({ msg: "Site data submitted successfully", data: site });
      console.log(site);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  });
});

// Updating Site:
app.put("/updateSite", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, site_name, position } = req.body;
    const siteDoc = await Site.findById(id);
    if (!siteDoc) return res.json("No Site with this site id.");
    await siteDoc.update({
      site_name,
      position,
      author: info.id,
    });

    res.json({ msg: "Site data Updated Successfully", date: req.body });
  });
});

// Delete Site:
app.put("/deleteSite", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id } = req.body;
    const siteDoc = await Site.findById(id);
    if (!siteDoc) return res.json("No Site with this site id.");

    await siteDoc.remove({});

    return res.json({ msg: "Site data Deleted Successfully" });
  });
});

// Create Categories
app.post(
  "/createCategory",
  uploadMiddleware.single("file"),
  async (req, res) => {
    const { name, color, tag_name, created_at, updated_at } = req.body;
    // console.log(req.body);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      try {
        const category = await Categories.create({
          name,
          color,
          tag_name,
          created_at,
          updated_at,
          author: info.id,
        });
        res.json({
          msg: "Category data submitted successfully",
          data: category,
        });
        console.log(category);
      } catch (e) {
        console.log(e);
        res.status(400).json(e);
      }
    });
  }
);

// Updating Categories
app.put(
  "/updateCategory",
  uploadMiddleware.single("file"),
  async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id, name, color, tag_name, created_at, updated_at } = req.body;
      const categoryDoc = await Categories.findById(id);
      if (!categoryDoc) return res.json("No Category with this site id.");
      await categoryDoc.update({
        id,
        name,
        color,
        tag_name,
        created_at,
        updated_at,
        author: info.id,
      });

      res.json({ msg: "Category data Updated Successfully", date: req.body });
    });
  }
);

// Delete Categories
app.put(
  "/deleteCategory",
  uploadMiddleware.single("file"),
  async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id } = req.body;
      const categoryDoc = await Categories.findById(id);
      if (!categoryDoc) return res.json("No Category with this site id.");

      await categoryDoc.remove({});

      return res.json({ msg: "Category data Deleted Successfully" });
    });
  }
);

// Create Drone
app.post("/createDrone", uploadMiddleware.single("file"), async (req, res) => {
  const {
    drone_id,
    created_at,
    deleted_by,
    deleted_on,
    drone_type,
    make_name,
    name,
    updated_at,
  } = req.body;
  // console.log(req.body);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    try {
      const drone = await Drone.create({
        drone_id,
        created_at,
        deleted_by,
        deleted_on,
        drone_type,
        make_name,
        name,
        updated_at,
        author: info.id,
      });
      res.json({
        msg: "Drone data submitted successfully",
        data: drone,
      });
      console.log(drone);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  });
});

// Updating Drone
app.put("/updateDrone", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const {
      id,
      drone_id,
      created_at,
      deleted_by,
      deleted_on,
      drone_type,
      make_name,
      name,
      updated_at,
    } = req.body;
    const droneDoc = await Drone.findById(id);
    if (!droneDoc) return res.json("No Drone with this drone id.");
    await droneDoc.update({
      id,
      drone_id,
      created_at,
      deleted_by,
      deleted_on,
      drone_type,
      make_name,
      name,
      updated_at,
      author: info.id,
    });

    res.json({ msg: "Drone data Updated Successfully", date: req.body });
  });
});

// Delete Drone
app.put("/deleteDrone", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id } = req.body;
    const droneDoc = await Drone.findById(id);
    if (!droneDoc) return res.json("No Drone with this drone id.");

    await droneDoc.remove({});

    return res.json({ msg: "Drone data Deleted Successfully" });
  });
});

app.listen(4000);
