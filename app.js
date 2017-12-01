const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const LocalStrategy = require('passport-local');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');
const express = require('express');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const keys = require('./config/keys');

// MODELS
const User = require('./models/user');
    
// ROUTES    
const blogRoutes = require('./routes/blogs');
const draftRoutes = require('./routes/drafts');
const commentRoutes = require('./routes/comments');
const replyRoutes = require('./routes/replies');
const indexRoutes = require('./routes/index');

// MONGOOSE CONFIG
mongoose.connect(keys.databaseURL);
mongoose.Promise = global.Promise;

// EMBEDDED JAVASCRIPT FOR VIEWS
app.set('view engine', 'ejs');

// MIDDLEWARE CONFIG
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());

// COOKIE CONFIG
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE FOR EVERY TEMPLATE
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ROUTES CONFIG
app.use('/blogs', blogRoutes);
app.use('/drafts', draftRoutes);
app.use('/blogs/:id/comments', commentRoutes);
app.use('/blogs/:id/comments/:comment_id/replies', replyRoutes);
app.use('/', indexRoutes);

// FIRE IT UP
app.listen(process.env.PORT || 8080, process.env.IP, () => {
  console.log('Server is running!');
});
