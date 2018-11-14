const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // hashing
const passport = require('passport');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'airport'
});
/* GET home page. */
router.get('/', function(req, res, next) {
  // we do search results via query string
  if (req.query){
    // do search results here 
    // not sure if we should write query here or make connection here. 
    connection.query('select * from flight where airline_name = ' + req.airline_name + ' or departure_airport = ' + req.departure_airport + ' or arrival_airport = ' + req.arrival_airport + ' or departure_time =  ' + req.departure_time , function (error, results, fields) {
      if (error) {throw error;}
      // connected!
      console.log(results);
      fields.forEach(function (field) {
          console.log(field.name);
      });
      res.render('index', {results: results});
    });
  } else {
    res.render('index', { title: 'Express' });
  }
});

router.get('/register', function(req, res, next) {
  // user registration form
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
  // user registration form
  // Look up the user and verify their password, if succesful redirect
  // to the proper landing/splash page for the type of user they are 
  res.redirect('/'); 
});

module.exports = router;
