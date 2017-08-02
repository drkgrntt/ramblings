var express = require("express");
var router = express.Router({mergeParams: true});
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var Reply = require("../models/reply");
var middleware = require("../middleware");

// NEW REPLY
router.get("/new", middleware.isLoggedIn, function(req, res) {
    
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, comment) {
                if(err) {
                    res.redirect("back");
                } else {
                    res.render("replies/new", {comment: comment, blog: blog});
                }
            });
        }
    });
});

// CREATE REPLY
router.post("/", middleware.isLoggedIn, function(req, res) {
    //look up blog post using ID
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            res.redirect("back");
        } else {
            //look up comment using ID
            Comment.findById(req.params.comment_id, function(err, comment) {
                if(err) {
                    res.redirect("back");
                } else {
                    req.body.reply.body = req.sanitize(req.body.reply.body);
                    Reply.create(req.body.reply, function(err, reply) {
                        if(err) {
                            res.redirect("back");
                        } else {
                            // add username and ID to reply
                            reply.author.id = req.user._id;
                            reply.author.username = req.user.username;
                            //save reply
                            reply.save();
                            comment.replies.push(reply);
                            comment.save();
                            req.flash("success", "Successfully replied to comment!");
                            res.redirect("/blogs/" + blog._id);
                        }
                    });
                }
            });
        }
    });
});

// EDIT REPLY
router.get("/:reply_id/edit", middleware.checkReplyOwnership, function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err) {
                    res.redirect("back");
                } else {
                    Reply.findById(req.params.reply_id, function(err, foundReply) {
                        if(err) {
                            res.redirect("back");
                        } else {
                            res.render("replies/edit", {blog_id: req.params.id, blog: foundBlog, comment_id: req.params.comment_id, comment: foundComment, reply: foundReply});
                        }
                    });
                }
            });
        }
    });
});

// UPDATE REPLY
router.put("/:reply_id", middleware.checkReplyOwnership, function(req, res) {
    Reply.findByIdAndUpdate(req.params.reply_id, req.body.reply, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DESTROY REPLY
router.delete("/:reply_id", middleware.checkReplyOwnership, function(req, res) {
    Reply.findByIdAndRemove(req.params.reply_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment reply deleted");
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = router;