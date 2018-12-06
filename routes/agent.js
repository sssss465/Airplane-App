const express = require('express');
const router = express.Router();
const connection = require('../db');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('splash', { user : req.user,
    action: {"flights": "View your flights",
                                  "spending": "View your spending"}});
});
router.get('/commission', (req, res, next) => {

});
router.get('/topcustomers', (req, res, next) => {

});
// TODO: change form to buy on behalf of customer
router.post('/buy', (req, res, next) => {
  // /booking_agent/buy
  // first query for number of seats
  // then we can insert purchases and ticket, after that
  const custemail = req.body.cemail; // todo customer email
  console.log(custemail);
  const flightnum = req.body.flight_num;
  connection.query('select flight_num, airline_name, seats from flight natural join airplane where flight_num = ?', [flightnum], (err, results, fields) => {
    if (err) {
      res.render('index', {buyerr: err});
      return;
    }
    const seats = results[0].seats;
    const airlinename = results[0].airline_name;
    connection.query('select count(ticket_id) as c from ticket', (err, results, fields) => {
      if (err) {
        res.render('index', {buyerr: err});
        return;
      }
      const newticketid = results[0].c + 1;
      connection.query('select count(ticket_id) as d from ticket where flight_num = ? group by flight_num ', [flightnum], (err, results, fields) => {
        if (err) {
          res.render('index', {buyerr: err});
          return;
        }
        const ticketsbought = (results[0] === undefined) ? 0 : results[0].d;
        if (seats - ticketsbought <= 0) {
          res.render('index', {buyerr: "no more seats"});
          return;
        } // safe to insert
        console.log('safe to insert');
        connection.query('insert into ticket values (?,?,?)', [newticketid, airlinename, flightnum], (err, results, fields) => {
          if (err) {
            res.render('index', {buyerr: err});
            return;
          }
          connection.query('insert into purchases values (?, ?, ?, ?)', [newticketid, custemail, req.user.email, new Date().toISOString("YYYY-MM-DD").substring(0, 10)], (err, results, fields) => {
            if (err) {
              res.render('index', {buyerr: "User email does not exist"});
              return;
            }
            res.render('success', {user: req.user, msg: "You bought a flight for " + flightnum + " on " + airlinename});
          });
        });
      });
    });
  });
  // res.redirect('back');
});
router.get('/flights', (req, res, next) => {
  // view my flights
  connection.query(
    "select *\n" +
    "from flight natural join \n" +
    "         (select distinct flight_num\n" +
    "          from ticket natural join purchases\n" +
    "          where customer_email = ?\n" +
    "         ) customer_flights\n" +
    "where status = 'upcoming'",
    [req.user.email],
    (error, results, fields) => {
      res.render('view-flights', {user: req.user, status: 'upcoming', results: results});
    }
  );
});

router.post('/flights', (req, res, next) => {
  // view my flights
  connection.query(
    "select *\n" +
    "from flight natural join \n" +
    "         (select distinct flight_num\n" +
    "          from ticket natural join purchases\n" +
    "          where customer_email = ?\n" +
    "         ) customer_flights\n" +
    "where status = ?",
    [req.user.email, req.body.flight_status],
    (error, results, fields) => {
      res.render('view-flights', {user: req.user, status: req.body.flight_status, results: results});
    }
  );
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
