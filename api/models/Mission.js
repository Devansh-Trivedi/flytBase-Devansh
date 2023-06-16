const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MissionSchema = new Schema({
  alt: { type: Number, required: true },
  speed: { type: Number, required: true },
  name: { type: String, required: true },
  waypoints: { type: Array, required: true },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

const MissionModel = model("Mission", MissionSchema);

module.exports = MissionModel;
