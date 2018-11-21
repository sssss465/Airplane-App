const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/login', (req, res, next) => {
  res.send('login things here');
});

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/login'},
    function (req, res) {
      res.redirect('/');
    }
  ));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('you\'ve authenticated as ' + res.user + '\n');
  } else {
    res.redirect('/login');
  }
});

router.get('/register', (req, res, next) => {
  // user registration form
  res.render('index', {title: 'Express'});
});

router.post('/register', (req, res, next) => {
  // user registration form
  res.redirect('/');
});

module.exports = router;
