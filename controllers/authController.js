const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.getLoginPage = catchAsync(async (req, res, next) => {
  res.status(200).render('admin/login');
});

exports.getRegisterPage = catchAsync(async (req, res, next) => {
  res.status(200).render('admin/register');
});

exports.register = catchAsync(async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  let errors = [];

  if (!username || !email || !password || !passwordConfirm) {
    errors.push({ msg: 'All fields must be entered' });
  }

  if (password !== passwordConfirm) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'password must be at least 6 characters long' });
  }

  if (errors.length > 0) {
    return res.render('admin/register', {
      errors,
      username,
      email,
    });
  } else {
    if (await User.findOne({ email: email })) {
      errors.push({ msg: 'This email is already registered' });
      return res.render('admin/register', {
        errors,
        username,
        email,
      });
    }
    if (await User.findOne({ username: username })) {
      errors.push({ msg: 'This username is already taken' });
      return res.render('admin/register', {
        errors,
        username,
        email,
      });
    }
    newUser = new User({
      email: email,
      username: username,
      password: password,
    });
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            console.log(user);
            req.flash(
              'success_msg',
              'Registered successfully, you can now login'
            );
            res.redirect('/login');
          })
          .catch((err) => console.log(err));
      })
    );
  }
});

exports.login = catchAsync(async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

exports.logout = catchAsync(async (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    //console.log(req.user);
    return next();
  }
  return next();
});

exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'You are not logged in, please log in to gain access');
  res.redirect('/login');
};
