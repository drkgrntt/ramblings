const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../middleware');
const keys = require('../config/keys');

// NODEMAILER CONFIG
let transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 25,
  secure: false,
  auth: {
    user: 'ramblingsblogger@gmail.com',
    pass: keys.emailPassword
  },
  tls: {
    rejectUnauthorized: false
  }
});

let emails = [];

// INDEX ROUTE
router.get('/', (req, res) => {
  Blog.find().sort({ created: -1 }).exec((err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { blogs });
    }
  });
});

// ALL BLOGS
router.get('/all', (req, res) => {
  Blog.find().sort({ created: 1 }).exec((err, blogs) => {
    if (err) {
      console.log(err);
    } else if (req.xhr) {
      res.json(blogs);
    } else {
      res.render('blog/all_blogs', { blogs });
    }
  });
});

// NEW ROUTE
router.get('/new', middleware.isAdmin, (req, res) => {
  res.render('blog/new');
});

// CREATE ROUTE
router.post('/', middleware.isAdmin, (req, res) => {
  // create blog
  Blog.create(req.body.blog, (err, blog) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Uh oh, something went wrong');
      res.redirect('/blogs');
    } else {
      // redirect to the index
      req.flash('success', 'Blog post created!');
      res.redirect('/blogs');
      User.find({}, (err2, allUsers) => {
        emails = [];
        allUsers.forEach((user) => {
          if (user.isSubscribed) {
            emails.push(user.email);
          }
        });
        emails.forEach((email) => {
          const mailOptions = {
            from: '"Ramblings Blog" <ramblingsblogger@gmail.com>',
            subject: 'New Blog Post!',
            html: '<p>Hi! I just created a new blog post!</p><br><a href="ramblings.herokuapp.com">Come check it out!</a>'
          };
          mailOptions.to = email;
          transporter.sendMail(mailOptions, (err3, info) => {
            if (err3) {
              console.log(err3);
            } else {
              console.log('Message sent: ', info.messageId, info.response);
            }
          });
        });
      });
    }
  });
});

// SHOW ROUTE
router.get('/:id', (req, res) => {
  Blog.findById(req.params.id)
  .populate('comments')
  .populate({ path: 'comments', populate: { path: 'replies' } })
  .exec((err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('blog/show', { blog: foundBlog });
    }
  });
});

// EDIT ROUTE
router.get('/:id/edit', middleware.isAdmin, (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('blog/edit', { blog: foundBlog });
    }
  });
});

// UPDATE ROUTE
router.put('/:id', middleware.isAdmin, (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});

// DELETE ROUTE
router.delete('/:id', middleware.isAdmin, (req, res) => {
  // destroy blog
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      //redirect somewhere
      req.flash('success', 'Blog post successfully deleted.');
      res.redirect('/blogs');
    }
  });
});

module.exports = router;
