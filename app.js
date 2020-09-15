const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const viewRouter = require('./routes/viewRoutes');
const blogRouter = require('./routes/blogRoutes');

//passport config
require('./controllers/passport')(passport);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(
  express.json({
    limit: '10kb',
  })
);
app.use(
  bodyParser.urlencoded({
    limit: '10mb',
    extended: false,
  })
);

app.use(
  session({
    secret: 'test',
    resave: true,
    saveUninitialized: true,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use(cookieParser());
//
//
app.use('/', viewRouter);
app.use('/api/v1/blog', blogRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
