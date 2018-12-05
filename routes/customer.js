const express = require('express');
const router = express.Router();
const connection = require('../db.js');

/* GET users listing. */
// customer route

router.post('/buy', (req, res, next) => { // /customer/buy
  // first query for number of seats
  // then we can insert purchases and ticket, after that 
  const flightnum = req.body.flight_num; 
  connection.query('select flight_num, airline_name, seats from flight natural join airplane where flight_num = ?', [flightnum], (err, results, fields) => {
    if (err) res.render('index', {buyerr : err});
    const seats = results[0].seats;
    const airlinename = results[0].airline_name;
    connection.query('select count(ticket_id) as c from ticket', (err, results, fields) => {
      if (err) res.render('index', {buyerr : err});
      const newticketid = results[0].c + 1;
      connection.query('select count(ticket_id) as d from ticket where flight_num = ? group by flight_num ', [flightnum], (err, results, fields) => {
        if (err) res.render('index', {buyerr : err});
        const ticketsbought = results[0].d;
        if (seats - ticketsbought <= 0) res.render('index', {buyerr : "no more seats"}); // safe to insert
        connection.query('insert into ticket values (?,?,?)', [newticketid, airlinename, flightnum], (err, results, fields) => {
          if (err) res.render('index', {buyerr : err});
          connection.query('insert into purchases values (?, ?, ?, ?', [newticketid, req.user.id, NULL, new Date().toISOString("YYYY-MM-DD").substring(0,10)], (err, results, fields) => {
            if (err) res.render('index', {buyerr : err});
            res.render('success', {msg : "You bought a flight for " + flightnum + " on " + airlinename});
          });
        });
      });
    });
  });
  // res.redirect('back');
});


router.get('/flights', (req, res, next) => {
  // view my flights
  res.send('respond with a resource');
});

router.get('/spending', (req, res, next) => {
  // view total spending
  console.log('user: ', req.user);
  connection.query(
    'select sum(price) as price\n' +
    'from (purchases natural join ticket) natural join flight\n' +
    'where customer_email = ? and\n' +
    '  purchase_date >= CURDATE() - interval 1 year',
    [req.user.email], (error, results, fields) => {
      if (error) {
        throw error;
      }
      console.log(req.user, results[0], fields);
      res.render('spending', {user: req.user, results: results[0]});
  });
});

router.post('/spending/search', (req, res, next) => {
  connection.query('select *', (error, results, fields) => {
    if (results.length === 0) {
      res.render('spending', {user: req.user, error: true, results: results});
    } else {
      res.render('spending', {user: req.user, results: results});
    }
  });
});

module.exports = router;
