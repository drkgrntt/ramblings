const express = require('express');

const router = express.Router({ mergeParams: true });
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const Reply = require('../models/reply');
const middleware = require('../middleware');

// NEW REPLY
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.redirect('back');
    } else {
      Comment.findById(req.params.comment_id, (err2, comment) => {
        if (err2) {
          res.redirect('back');
        } else {
          res.render('replies/new', { comment, blog });
        }
      });
    }
  });
});

// CREATE REPLY
router.post('/', middleware.isLoggedIn, (req, res) => {
  //look up blog post using ID
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.redirect('back');
    } else {
      //look up comment using ID
      Comment.findById(req.params.comment_id, (err2, comment) => {
        if (err2) {
          res.redirect('back');
        } else {
          Reply.create(req.body.reply, (err3, reply) => {
            if (err3) {
              res.redirect('back');
            } else {
              // add username and ID to reply
              reply.author.id = req.user._id;
              reply.author.username = req.user.username;
              //save reply
              reply.save();
              comment.replies.push(reply);
              comment.save();
              req.flash('success', 'Successfully replied to comment!');
              res.redirect(`/blogs/${blog._id}`);
            }
          });
        }
      });
    }
  });
});

// EDIT REPLY
router.get('/:reply_id/edit', middleware.checkReplyOwnership, (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('back');
    } else {
      Comment.findById(req.params.comment_id, (err2, foundComment) => {
        if (err2) {
          res.redirect('back');
        } else {
          Reply.findById(req.params.reply_id, (err3, foundReply) => {
            if (err3) {
              res.redirect('back');
            } else {
              res.render('replies/edit', {
                blog_id: req.params.id, 
                blog: foundBlog, 
                comment_id: req.params.comment_id, 
                comment: foundComment, 
                reply: foundReply
              });
            }
          });
        }
      });
    }
  });
});

// UPDATE REPLY
router.put('/:reply_id', middleware.checkReplyOwnership, (req, res) => {
    Reply.findByIdAndUpdate(req.params.reply_id, req.body.reply, (err) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});

// DESTROY REPLY
router.delete('/:reply_id', middleware.checkReplyOwnership, (req, res) => {
    Reply.findByIdAndRemove(req.params.reply_id, (err) => {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment reply deleted');
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});

module.exports = router;
