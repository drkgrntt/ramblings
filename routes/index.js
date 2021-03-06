const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const middleware = require('../middleware');
const keys = require('../config/keys');

// MAKE /BLOGS THE LANDING PAGE
router.get('/', (req, res) => {
  res.redirect('/blogs');
});

// USER REGISTRATION FORM
router.get('/register', (req, res) => {
  res.render('register');
});

// HANDLE REGISTER LOGIC
router.post('/register', (req, res) => {
  // user info
  const newUser = new User({ 
    username: req.body.username, 
    email: req.body.email 
  });
  // check for admin access
  if (req.body.adminCode === keys.adminCode) {
    newUser.isAdmin = true;
  }
  // register new user with their password
  User.register(newUser, req.body.password, (err) => {
    // if the username is taken
    if (err) {
      req.flash('error', 'Please try a different username or email');
      return res.redirect('register');
    }
    // create new user
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Successfully created account!');
      res.redirect('/blogs');
    });
  });
});

// LOGIN ROUTE
router.get('/login', (req, res) => {
  res.render('login');
});

// HANDLE LOGIN LOGIC
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/blogs',
    failureRedirect: '/login'
  }), () => {
});

// SUBSCRIBE LOGIC
router.put('/:user_id', middleware.isLoggedIn, (req, res) => {
  // find current user and switch isSubscribed boolean
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
