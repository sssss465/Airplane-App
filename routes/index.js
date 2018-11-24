const express = require('express');
const router = express.Router();

/* GET home page. */
// https://stackoverflow.com/a/20719659 in order to pass the variable from app.js to the router

router.get('/', function(req, res, next) {
  // we do search results via query string
  // http://localhost:3000/?source_airport=JFK&dest_airport=PVG&date=2017-Aug-16
  // working query
  const connection = req.app.get('pool');
  if (!(Object.keys(req.query).length === 0 && req.query.constructor === Object)){
    // do search results here
    // not sure if we should write query here or make connection here.
    console.log(req.query);
    const rq = req.query;
    connection.query('select * from flight where departure_airport = ?' + ' or arrival_airport = ?' + ' and departure_time >=  ?',[rq.source_airport, rq.dest_airport, rq.date], function (error, results, fields) {
      if (error) {throw error;}
      // connected!
      console.log(results);
      if (results.length === 0){
        res.render('index', {error: true, results: results});
      } else {
        res.render('index', {results: results});
      }
    });
  } else {
    res.render('index');
  }
});

router.get("/register", (req, res, next) => {
  res.render('register');
});
router.get("/login", (req, res, next) => {
  res.render('login');
});


module.exports = router;
