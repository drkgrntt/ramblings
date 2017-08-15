const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Blog = require('../models/blog');
const middleware = require('../middleware');

router.get('/', (req, res) => {
  res.redirect('/blogs');
});

// REGISTER
router.get('/register', (req, res) => {
  res.render('register');
});

// HANDLE REGISTER LOGIC
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username, email: req.body.email });
  if (req.body.adminCode === process.env.ADMINCODE) {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err) => {
    if (err) {
      req.flash('error', 'Please try a different username or email');
      return res.redirect('register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Successfully created account!');
      res.redirect('/blogs');
    });
  });
});

// LOGIN
router.get('/login', (req, res) => {
  res.render('login');
});

// HANDLE LOGIN LOGIC
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/blogs',
    failureRedirect: 'login'
  }), () => {
});

// SUBSCRIBE LOGIC
router.put('/:user_id', middleware.isLoggedIn, (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body.user, (err) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.redirect('/blogs');
    }
  });
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/blogs');
});

module.exports = router;
