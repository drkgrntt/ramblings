const mongoose = require('mongoose');

const h2hSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  price: String,
  url: String
});

module.exports = mongoose.model('h2h', h2hSchema);
