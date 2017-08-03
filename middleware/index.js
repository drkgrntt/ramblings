const Comment = require('../models/comment');
const Reply = require('../models/reply');
const User = require('../models/user');

// all middleware goes here
const middlewareObj = {};

middlewareObj.isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }
  res.redirect('/blogs');
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  //is user logged in?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash('error', 'You need to be logged in to do that.');
        res.redirect('back');
      } else {
        //does user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
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

middlewareObj.checkReplyOwnership = (req, res, next) => {
  //is user logged in?
  if (req.isAuthenticated()) {
    Reply.findById(req.params.reply_id, (err, foundReply) => {
      if (err) {
        req.flash('error', 'You need to be logged in to do that.');
        res.redirect('back');
      // does the user own the comment?
      } else if (foundReply.author.id.equals(req.user._id)) {
        next();
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

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please login first!');
  res.redirect('/login');
};

module.exports = middlewareObj;
