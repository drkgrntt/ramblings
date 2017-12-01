const express = require('express');

const router = express.Router();
const Draft = require('../models/draft');
const middleware = require('../middleware');

// DRAFTS ARE TO SAVE BLOG IDEAS WITHOUT DISPLAYING THEM TO THE PUBLIC
// ALL DRAFT ROUTES ARE ONLY AVAILABLE TO ADMIN USERS

// INDEX ROUTE
router.get('/', middleware.isAdmin, (req, res) => {
  // find all drafts
  Draft.find({}, (err, drafts) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.render('draft/index', { drafts });
    }
  });
});

// CREATE ROUTE
router.post('/', middleware.isAdmin, (req, res) => {
  // create a draft with data in req.body.blog
  Draft.create(req.body.blog, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Uh oh, something went wrong.');
      res.redirect('back');
    } else {
      req.flash('success', 'Successfully saved as a draft!');
      res.redirect('/drafts');
    }
  });
});

// SHOW ROUTE
router.get('/:id', (req, res) => {
  // find selected draft to expand
  Draft.findById(req.params.id, (err, foundDraft) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('draft/show', { draft: foundDraft });
    }
  });
});

// EDIT ROUTE
router.get('/:id/edit', middleware.isAdmin, (req, res) => {
  // find selected draft to update
  Draft.findById(req.params.id, (err, foundDraft) => {
    if (err) {
      res.redirect('/drafts');
    } else {
      res.render('draft/edit', { draft: foundDraft });
    }
  });
});

// UPDATE ROUTE
router.put('/:id', middleware.isAdmin, (req, res) => {
  // update selected draft with data in req.body.blog from the update form
  Draft.findByIdAndUpdate(req.params.id, req.body.blog, (err) => {
    if (err) {
      res.redirect('/drafts');
    } else {
      res.redirect(`/drafts/${req.params.id}`);
    }
  });
});

// DELETE ROUTE
router.delete('/:id', middleware.isAdmin, (req, res) => {
  // delete selected draft
  Draft.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      req.flash('success', 'Draft successfully deleted.');
      res.redirect('/drafts');
    }
  });
});

module.exports = router;
