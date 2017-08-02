const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
  res.redirect('/blogs');
});

// REGISTER
router.get('/register', (req, res) => {
  res.render('register');
});

// HANDLE REGISTER LOGIC
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  if (req.body.adminCode === process.env.ADMINCODE) {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err) => {
    if (err) {
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

// LOGOUT
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/blogs');
});

module.exports = router;
