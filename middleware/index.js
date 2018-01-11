const Comment = require('../models/comment');
const Reply = require('../models/reply');
const User = require('../models/user');

// all middleware goes here
const middlewareObj = {};

// check if user is an admin
middlewareObj.isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }
  res.redirect('/blogs');
};

// check if user owns the comment
middlewareObj.checkCommentOwnership = (req, res, next) => {
  // is user logged in?
  if (req.isAuthenticated()) {
    // find selected comment
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash('error', 'You need to be logged in to do that.');
        res.redirect('back');
      } else {
        // does user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        // trump card: is the user an admin?
        } else if (req.user.isAdmin) {
          next();
        } else {
          req.flash('error', 'You don\'t have permission to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('back');
  }
};

// check if user owns the reply
middlewareObj.checkReplyOwnership = (req, res, next) => {
  // is user logged in?
  if (req.isAuthenticated()) {
    // find selected reply
    Reply.findById(req.params.reply_id, (err, foundReply) => {
      if (err) {
        req.flash('error', 'You need to be logged in to do that.');
        res.redirect('back');
      // does the user own the comment?
      } else if (foundReply.author.id.equals(req.user._id)) {
        next();
      // trump card, is the user an admin?
      } else if (req.user.isAdmin) {
        next();
      } else {
        req.flash('error', 'You don\'t have permission to do that.');
        res.redirect('back');
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('back');
  }
};

// check if user is logged in
middlewareObj.isLoggedIn = (req, res, next) => {
  // is user logged in?
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please login first or create an account using the "Sign Up" button in the top right corner!');
  res.redirect('/login');
};

module.exports = middlewareObj;
