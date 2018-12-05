const express = require('express');
const router = express.Router();
const connection = require('../db.js');

/* GET users listing. */

router.post('/buy', (req, res, next) => {


});

router.get('/flights', (req, res, next) => {
  // view my flights
  res.send('respond with a resource');
});

router.get('/spending', (req, res, next) => {
  // view total spending
  console.log('req.body: ', req.body);
  connection.query(
    'select sum(price) as price\n' +
    'from (purchases natural join ticket) natural join flight\n' +
    'where customer_email = ? and\n' +
    '  purchase_date >= CURDATE() - interval 1 year',
    [req.user.email], (error, results, fields) => {
      if (error) {
        throw error;
      }
      const price = (results[0].price === null) ? 0 : results[0].price;
      res.render('spending', {user: req.user, sum_str_msg: "Your spending is " + price + " in the past year"});
    });
});

router.post('/spending', (req, res, next) => {
  console.log('req.body: ', req.body);
  let data = JSON.stringify([{a: 1, b: 2}, {a: 3, b: 2}, {a: 2, b: 4}]);
  let price = null;
  connection.query(
    "select date_format(purchase_date, '%Y-%m') `date`, sum(price) value\n" +
    "from (purchases natural join ticket) natural join flight\n" +
    "where customer_email = ? and\n" +
    "  purchase_date >= ? and\n" +
    "  purchase_date <= ?\n" +
    "group by date_format(purchase_date, '%Y-%m'), month(purchase_date)\n" +
    "order by `date`",
    [req.user.email, req.body.begin, req.body.end], (error, results, fields) => {
      if (error) {
        throw error;
      }
      console.log('results: ', results);

      // const data = results.map(d => {
      //   return {date: d.date, value: d.value};
      // });
      data = JSON.stringify(results);
      console.log('data: ', data);
    });

  connection.query(
    'select sum(price) as price\n' +
    'from (purchases natural join ticket) natural join flight\n' +
    'where customer_email = ? and\n' +
    '  purchase_date >= ? and\n' +
    '  purchase_date <= ?',
    [req.user.email, req.body.begin, req.body.end], (error, results, fields) => {
      if (error) {
        throw error;
      }
      price = (results[0].price === null) ? 0 : results[0].price;
    });

  res.render('spending', {
    user: req.user,
    data: data,
    sum_str_msg: "Your spending is " + price + " between " + req.body.begin + " and " + req.body.end
  });
});

module.exports = router;
