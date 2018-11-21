const express = require('express');
const router = express.Router();

/* GET home page. */
// https://stackoverflow.com/a/20719659 in order to pass the variable from app.js to the router

router.get('/', function(req, res, next) {
  // we do search results via query string
  const connection = req.app.get('pool');
  if (!(Object.keys(req.query).length === 0 && req.query.constructor === Object)){
    // do search results here
    // not sure if we should write query here or make connection here.
    console.log(req.query);
    const rq = req.query;
    connection.query('select * from flight where airline_name = ?' + ' or departure_airport = ?' + ' or arrival_airport = ?' + ' or departure_time =  ?',[rq.airline_name, rq.departure_airport, rq.arrival_airport, rq.departure_time], function (error, results, fields) {
      if (error) {throw error;}
      // connected!
      console.log(results);
      res.render('index', {results: results});
    });
  } else {
    res.render('index', { title: 'Express' });
  }
});

module.exports = router;
