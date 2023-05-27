const mongoose = require("mongoose");

// Create a Mongoose schema for the saved memes
const savedMemeSchema = new mongoose.Schema({
  title: String,
  postLink: String,
  image: String,
  upvotes: Number,
  userId: String,
});

// Create a Mongoose model based on the schema
module.exports = mongoose.model("SavedMeme", savedMemeSchema);
