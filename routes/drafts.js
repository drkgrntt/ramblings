const express = require('express');

const router = express.Router();
const Draft = require('../models/draft');
const middleware = require('../middleware');

// INDEX ROUTE
router.get('/', middleware.isAdmin, (req, res) => {
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
  req.body.blog.body = req.sanitize(req.body.blog.body);
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
  req.body.blog.body = req.sanitize(req.body.blog.body);
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
