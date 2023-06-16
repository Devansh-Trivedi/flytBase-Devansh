const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DroneSchema = new Schema({
  drone_id: { type: String, required: true },

  created_at: { type: Object, required: true },
  deleted_at: { type: String, required: true },
  deleted_on: { type: Object, required: true },
  drone_type: { type: String, required: true },
  make_name: { type: String, required: true },
  name: { type: String, required: true },
  updated_at: { type: Object, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

const CategoriesModel = model("Categories", CategoriesSchema);

module.exports = CategoriesModel;
