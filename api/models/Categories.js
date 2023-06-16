const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CategoriesSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  tag_name: { type: String, required: true },
  created_at: { type: Object, required: true },
  updated_at: { type: Object, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

const CategoriesModel = model("Categories", CategoriesSchema);

module.exports = CategoriesModel;
