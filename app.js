var expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require("method-override"),
    LocalStrategy       = require("passport-local"),
    bodyParser          = require("body-parser"),
    passport            = require("passport"),
    mongoose            = require("mongoose"),
    express             = require("express"),
    flash               = require("connect-flash"),
    app                 = express(),

// MODELS
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    Blog                = require("./models/blog"),
    Reply               = require("./models/reply"),
    
// ROUTES    
    blogRoutes          = require("./routes/blogs"),
    commentRoutes       = require("./routes/comments"),
    replyRoutes         = require("./routes/replies"),
    indexRoutes         = require("./routes/index");

// APP CONFIG
var url = process.env.DATABASEURL || "mongodb://localhost/blog_app";
mongoose.connect(url);
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

// SESSION CONFIG
app.use(require("express-session")(
    {
        secret: "Once again Maggie wins cutest dog!",
        resave: false,
        saveUninitialized: false
    },
    {
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: 10 * 60 * 1000
        },
        rolling: true
    }
));

// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FOR EVERY TEMPLATE
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ROUTES CONFIG
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);
app.use("/blogs/:id/comments/:comment_id/replies", replyRoutes);
app.use("/", indexRoutes);

// FIRE IT UP
app.listen(process.env.PORT || 8080, process.env.IP, function() {
    console.log("Server is running!");
});