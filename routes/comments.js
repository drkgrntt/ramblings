const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router({ mergeParams: true });
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const middleware = require('../middleware');

let mailer = nodemailer.createTransport({
  service: 'gmail',
  port: 25,
  secure: false,
  auth: {
    user: 'ramblingsblogger@gmail.com',
    pass: process.env.EMAILPASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

let mailTo = {
  from: '"Ramblings Blog" <ramblingsblogger@gmail.com>',
  to: 'cmaxey02@gmail.com',
  subject: 'New Comment!',
  html: '<p>Someone commented on a post!<br><a href="ramblings.herokuapp.com">Check it out!</a></p>'
};

// NEW COMMENT
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/new', { blog });
    }
  });
});

// CREATE COMMENT
router.post('/', middleware.isLoggedIn, (req, res) => {
  // lookup blog post using ID
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      Comment.create(req.body.comment, (err2, comment) => {
        if (err2) {
          res.redirect('back');
        } else {
          // add username and ID to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          blog.comments.push(comment);
          blog.save();
          req.flash('success', 'Successfully created new comment!');
          res.redirect(`/blogs/${blog._id}`);
          mailer.sendMail(mailTo, (err3, info) => {
            if (err3) {
              console.log(err3);
            } else {
              console.log('Message sent: ', info.messageId, info.response);
            }
          });
        }
      });
    }
  });
});

// EDIT COMMENT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('back');
    } else {
      Comment.findById(req.params.comment_id, (err2, foundComment) => {
        if (err2) {
          res.redirect('back');
        } else {
          res.render('comments/edit', { 
            blog_id: req.params.id, 
            blog: foundBlog, 
            comment: foundComment 
          });
        }
      });     
    }
  });
});

// UPDATE COMMENT
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});

// DESTROY COMMENT
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});

module.exports = router;
