const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const h2h = require('../models/heartlandToHome');

// INDEX LISTINGS
router.get('/', (req, res) => {
  h2h.find({}, (err, listings) => {
    if(err) {
      console.log(err);
    } else {
      res.render('h2h/index', { listings });
    }
  });
});

// NEW LISTING ROUTE
router.get('/new', middleware.isAdmin, (req, res) => {
  res.render('h2h/new');
});

// CREATE LISTING ROUTE
router.post('/', middleware.isAdmin, (req, res) => {
  h2h.create(req.body.h2h, (err, listing) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Listing successfully created!');
      res.redirect('/heartlandtohome');
    }
  });
});

// EDIT LISTING ROUTE
router.get('/:id/edit', middleware.isAdmin, (req,res) => {
  h2h.findById(req.params.id, (err, listing) => {
    if(err) {
      res.redirect('/heartlandtohome');
    } else {
      res.render('h2h/edit', { listing });
    }
  });
});

// UPDATE LISTING ROUTE
router.put('/:id', middleware.isAdmin, (req, res) => {
  h2h.findByIdAndUpdate(req.params.id, req.body.h2h, (err) => {
    if (err) {
      res.redirect('/heartlandtohome');
    } else {
      req.flash('success', 'Listing successfully edited');
      res.redirect('/heartlandtohome');
    }
  });
});

router.delete('/:id', middleware.isAdmin, (req, res) => {
  h2h.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Listing successfully deleted.');
      res.redirect('/heartlandtohome');
    }
  });
});

module.exports = router;
