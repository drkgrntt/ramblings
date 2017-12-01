const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  category: String
  // created comes when draft becomes a blog
  // comments unavailable until draft becomes a blog
});

module.exports = mongoose.model('Draft', draftSchema);
