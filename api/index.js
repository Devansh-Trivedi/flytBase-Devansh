const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Mission = require("./models/Mission");
const Site = require("./models/Site");
const Categories = require("./models/Categories");

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
// Password: IMdKNnZaHBwsrQov
// Username: tridevansh160601

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

// mongoose.connect('mongodb+srv://tridevansh160601:IMdKNnZaHBwsrQov@cluster0.w3cl69x.mongodb.net/?retryWrites=true&w=majority');

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

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await postDoc.update({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
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
app.put("/deleteCategory", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id } = req.body;
    const categoryDoc = await Categories.findById(id);
    if (!categoryDoc) return res.json("No Category with this site id.");

    await categoryDoc.remove({});

    return res.json({ msg: "Category data Deleted Successfully" });
  });
});

app.listen(4000);
