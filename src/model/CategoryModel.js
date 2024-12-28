const mongoose = require('mongoose');

// Define the Categories Schema
const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    win: {
      type: Number,
      min: 0, 
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
