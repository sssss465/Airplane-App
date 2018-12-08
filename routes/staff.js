const express = require('express');
const router = express.Router();
const connection = require('../db.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/flights', (req, res, next) => {
  // view my flights
  req.body.begin = req.body.begin === '' ? '1970-01-01' : req.body.begin;
  req.body.end = req.body.end === '' ? '2030-01-01' : req.body.end;
  connection.query(
    "select *\n" +
    "from flight\n" +
    "       natural join (select c.name, flight_num\n" +
    "                     from customer c\n" +
    "                            join purchases p on c.email = p.customer_email\n" +
    "                            join ticket t on p.ticket_id = t.ticket_id) customer_flight\n" +
    "where arrival_time <= curdate() + interval 1 month\n" +
    "  and departure_time >= curdate()\n" +
    "  and airline_name = ?",
    [req.user.airline_name],
    (error, results, fields) => {
      res.render('operated-flights', {
        user: req.user,
        title: 'Flights operated by ' + req.user.airline_name,
        results: results
      });
    }
  );
});

router.post('/flights', (req, res, next) => {
  // view my flights
  req.body.begin = req.body.begin === '' ? '1970-01-01' : req.body.begin;
  req.body.end = req.body.end === '' ? '2030-01-01' : req.body.end;
  connection.query(
    "select *\n" +
    "from flight\n" +
    "       natural join (select c.name, flight_num\n" +
    "                     from customer c\n" +
    "                            join purchases p on c.email = p.customer_email\n" +
    "                            join ticket t on p.ticket_id = t.ticket_id) customer_flight\n" +
    "where arrival_time <= ?\n" +
    "  and departure_time >= ?\n" +
    "  and arrival_airport = ?\n" +
    "  and departure_airport = ?\n" +
    "  and airline_name = ?",
    [req.body.end, req.body.begin, req.body.arrive_airport, req.body.depart_airport, req.user.airline_name],
    (error, results, fields) => {
      res.render('operated-flights', {
        user: req.user,
        title: 'Flights operated by ' + req.user.airline_name,
        results: results
      });
    }
  );
});

module.exports = router;
