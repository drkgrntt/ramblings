const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  created: {
    type: Date, 
    default: Date.now
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply'
    }
  ]
});

module.exports = mongoose.model('Comment', commentSchema);
