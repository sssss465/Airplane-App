const express = require('express');
const router = express.Router();
const passport = require('passport');
const connection = require('../db.js');

/* GET home page. */
// https://stackoverflow.com/a/20719659 in order to pass the variable from app.js to the router

router.get('/', function (req, res, next) {
  // we do search results via query string
  // http://localhost:3000/?source_airport=JFK&dest_airport=PVG&date=2017-Aug-16
  // working query
  if (!(Object.keys(req.query).length === 0 && req.query.constructor === Object)) {
    // do search results here
    // not sure if we should write query here or make connection here.
    console.log(req.query);
    const rq = req.query;
    const date = rq.date === '' ? '1970-01-01' : rq.date;
    const arrival = rq.arrival === '' ? '2030-01-01' : rq.arrival;
    connection.query('select * from flight where departure_airport = ?' + ' and arrival_airport = ?' + ' and (departure_time >=  ? and arrival_time <= ?)', [rq.source_airport, rq.dest_airport, date, arrival], function (error, results, fields) {
      if (error) {
        throw error;
      }
      // connected!
      // console.log(results);
      if (results.length === 0) {
        res.render('index', {user: req.user, error: true, results: results});
      } else {
        res.render('index', {user: req.user, results: results});
      }
    });
  } else {
    console.log('logged in user', req.user);
    res.render('index', {user: req.user});
  }
});
router.get('/register', (req, res, next) => {
  res.render('register');
});
router.get('/login', (req, res, next) => {
  res.render('login');
});
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
router.post('/register', (req, res, next) => {
  // make db call to check no conflicting users
  // then redirect to user page
  passport.authenticate('local-register', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (info) {
      console.log(info);
    }
    if (!user) {
      return res.render('register', {message: info.signupMessage});
    }
    console.log("WELCOME TO THE SITE !");
    req.login(user, (err) => {
      if (err) {
        throw err;
      }
      res.redirect('/');
    });

  })(req, res, next);
});
router.post('/login', (req, res, next) => {
  //redirect to user page if success otherwise stay on login with error
  passport.authenticate('local-login', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (info) {
      console.log(info);
    }
    if (!user) {
      return res.render('login', {message: info.loginMessage});
    }
    console.log("WELCOME TO THE SITE ! (login)");
    req.login(user, (err) => {
      if (err) {
        throw err;
      }
      res.redirect(req.session.returnTo || '/');
      delete req.session.returnTo;
    });
  })(req, res, next);
});


module.exports = router;
