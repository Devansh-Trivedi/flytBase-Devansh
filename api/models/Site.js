const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SiteSchema = new Schema({
  site_name: { type: String, required: true },
  position: { type: Array, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

const SiteModel = model("Site", SiteSchema);

module.exports = SiteModel;
