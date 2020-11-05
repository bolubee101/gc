const mongoose = require("mongoose");

// UserSchema
const Schema = mongoose.Schema;

const boundaryschema = new Schema({
  "bottom": {
    type: Array
  },
  "left": {
    type: Array
  },
  "right": {
    type: Array
  },
  "fontsize": {
    type: Number
  },
  "color": {
    type: String
  },
  "link": {
    type: String
  },
  "src": {
    type: String
  }
});

let boundary = mongoose.model("boundary", boundaryschema);

module.exports =boundary

// bottom color fontsize left right link src