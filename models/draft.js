const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String
});

module.exports = mongoose.model('Draft', draftSchema);
