const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  category: String,
  created: { type: Date, default: Date.now },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model('Blog', blogSchema);
