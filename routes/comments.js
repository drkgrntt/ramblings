var express = require("express");
var router = express.Router({mergeParams: true});
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var Reply = require("../models/reply");
var middleware = require("../middleware");

// NEW COMMENT
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/new", {blog: blog});
        }
    });
});

// CREATE COMMENT
router.post("/", middleware.isLoggedIn, function(req, res) {
    // lookup blog post using ID
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            req.body.comment.body = req.sanitize(req.body.comment.body);
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    res.redirect("back");
                } else {
                    // add username and ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    blog.comments.push(comment);
                    blog.save();
                    req.flash("success", "Successfully created new comment!");
                    res.redirect("/blogs/" + blog._id);
                }
            });
        }
    });
});

// EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err) {
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {blog_id: req.params.id, blog: foundBlog, comment: foundComment});
                }
            });     
        }
    });
});

// UPDATE COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DESTROY COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = router;