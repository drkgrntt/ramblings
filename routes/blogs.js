var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var Reply = require("../models/reply");
var middleware = require("../middleware");

// INDEX ROUTE
router.get("/", function(req, res) {
    Blog.find().sort({created: 1}).exec(function(err, blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW ROUTE
router.get("/new", middleware.isAdmin, function(req, res) {
    res.render("blog/new");
});

// CREATE ROUTE
router.post("/", middleware.isAdmin, function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // create blog
    Blog.create(req.body.blog, function(err, newlyCreated) {
        if(err) {
            console.log(err);
            req.flash("error", "Uh oh, something went wrong");
            res.redirect("/blogs");
        } else {
            // redirect to the index
            req.flash("success", "Blog post created!");
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
router.get("/:id", function(req, res) {
    Blog.findById(req.params.id)
    .populate("comments")
    .populate({ path: "comments", populate: { path: "replies" }})
    .exec(function(err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("blog/show", {blog: foundBlog});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.isAdmin, function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("blog/edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.isAdmin, function(req, res) {
    req.body.blog.body =  req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE
router.delete("/:id", middleware.isAdmin, function(req, res) {
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            //redirect somewhere
            req.flash("success", "Blog post successfully deleted.");
            res.redirect("/blogs");
        }
    });
});

module.exports = router;