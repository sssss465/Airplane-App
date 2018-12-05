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
  connection.query(
    "select date_format(purchase_date, '%Y-%m') `date`, sum(price) value\n" +
    "from (purchases natural join ticket) natural join flight\n" +
    "where customer_email = ? and\n" +
    "  purchase_date <= curdate() and\n" +
    "  purchase_date >= curdate() - interval 6 month\n" +
    "group by date_format(purchase_date, '%Y-%m'), month(purchase_date)\n" +
    "order by `date`",
    [req.user.email], (error, results, fields) => {
      if (error) {
        throw error;
      }
      const data = JSON.stringify(results);

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
          res.render('spending', {
            user: req.user,
            data: data,
            sum_str_msg: "Your spending is " + price + " in the past year"
          });
        });
    });
});

router.post('/spending', (req, res, next) => {
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

      // const data = results.map(d => {
      //   return {date: d.date, value: d.value};
      // });
      const data = JSON.stringify(results);

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
          const price = (results[0].price === null) ? 0 : results[0].price;
          res.render('spending', {
            user: req.user,
            data: data,
            sum_str_msg: "Your spending is " + price + " between " + req.body.begin + " and " + req.body.end
          });
        });
    });
});

module.exports = router;
