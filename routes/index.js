var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.redirect("/blogs");
});

// REGISTER
router.get("/register", function(req, res){
    res.render("register");
});

// HANDLE REGISTER LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === process.env.ADMINCODE){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully created account!");
            res.redirect("/blogs");
        });
    });
});

// LOGIN
router.get("/login", function(req, res){
    res.render("login");
});

// HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "login"
    }), function(req, res){
});

// LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/blogs");
});

module.exports = router;