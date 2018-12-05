const express = require('express');
const router = express.Router();
const connection = require('../db.js');

/* GET users listing. */
// customer route

router.post('/buy', (req, res, next) => { // /customer/buy

  // first query for number of seats
  // then we can insert purchases and ticket, after that 
  const ticket = req.body; 
  console.log("bought ticket is ", ticket);
  res.redirect('back');
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
