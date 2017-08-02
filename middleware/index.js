var Blog = require("../models/blog");
var Comment = require("../models/comment");
var Reply = require("../models/reply");

// all middleware goes here
var middlewareObj = {};

middlewareObj.isAdmin = function(req, res, next){
    if(req.user.isAdmin){
        return next();
    }
    res.redirect("/blogs");
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "You need to be logged in to do that.");
                res.redirect("back");
            } else {
                //does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else if (req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkReplyOwnership = function(req, res, next) {
    //is user logged in?
    if(req.isAuthenticated()) {
        Reply.findById(req.params.reply_id, function(err, foundReply) {
            if(err){
                req.flash("error", "You need to be logged in to do that.");
                res.redirect("back");
            } else {
                //does user own the comment?
                if(foundReply.author.id.equals(req.user._id)){
                    next();
                } else if (req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
};

module.exports = middlewareObj;