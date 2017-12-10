const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cloudinary = require('cloudinary');

const router = express.Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../middleware');
const keys = require('../config/keys');

// MULTER CONFIG
const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true)
};
const upload = multer({ storage, fileFilter: imageFilter });

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: 'drkgrntt',
  api_key: keys.cloudinaryKey,
  api_secret: keys.cloudinarySecret
});

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
  // newest blog posts at the top
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
  // oldest blog posts at the top
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

// NEW BLOG ROUTE
router.get('/new', middleware.isAdmin, (req, res) => {
  res.render('blog/new');
});

// CREATE ROUTE
router.post('/', middleware.isAdmin, upload.single('image'), (req, res) => {
  // upload picture to cloudinary
  cloudinary.uploader.upload(req.file.path, (result) => {
    // use cloudinary image url as req.body.blog.image
    req.body.blog.image = result.secure_url;
    // create new blog post with data in req.body.blog
    Blog.create(req.body.blog, (err, blog) => {
      if (err) {
        req.flash('error', 'Uh oh, something went wrong');
        res.redirect('/blogs');
      } else {
        // redirect to the index
        req.flash('success', 'Blog post created!');
        res.redirect('/blogs');
        // after blog is created, find all users
        User.find({}, (err2, allUsers) => {
          // clear the emails array
          emails = [];
          // if the user is subscribed, add their email to the emails array
          allUsers.forEach((user) => {
            if (user.isSubscribed) {
              emails.push(user.email);
            }
          });
          // send all subscribed users an email notification of a new blog post
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
});

// SHOW ROUTE
router.get('/:id', (req, res) => {
  // find selected blog post
  Blog.findById(req.params.id)
  // find nested comments
  .populate('comments')
  // find nested comment replies
  .populate({ path: 'comments', populate: { path: 'replies' } })
  .exec((err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      // add a view to page view counter
      foundBlog.views ++;
      foundBlog.save();
      // render blog
      res.render('blog/show', { blog: foundBlog });
    }
  });
});

// EDIT ROUTE
router.get('/:id/edit', middleware.isAdmin, (req, res) => {
  // find selected blog post for the update form
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
  // update selected blog with data in req.body.blog
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
