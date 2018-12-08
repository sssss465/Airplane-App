const express = require('express');
const router = express.Router();
const connection = require('../db');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('splash', {
    user: req.user,
    action: {
      "createflight": "Create new flights",
      "createplane": "Create new planes",
      'createairport': "Create new airports",
      'viewbookingagents': "View booking agents",
      'viewcustomers': "View customers",
      'reports': "Total amount of tickets sold given range of dates",
      'revenue': "Revenue from direct vs indirect sales",
      'topdestinations': "3 most popular destinations for last 3 monts and last yr",
    }
  });
});

router.get('/createflight', (req, res, next) => {

});
router.post('/createflight', (req, res, next) => {

});
router.get('/createplane', (req, res, next) => {
  connection.query('select * from airplane where airline_name=?', [req.user.airline_name], (err, results, fields) => {
    if (err) {
      throw err;
    }
    res.render('createplane', {
      user: req.user,
      results: results
    });
  });
});
router.post('/createplane', (req, res, next) => {
  connection.query('insert into airplane values(?,?,?)', [req.body.airline_name, req.body.airplane_id, req.body.seats], (err, results, fields) => {
    if (err) {
      throw err;
    }
    res.redirect('createplane');
  });
});
router.get('/createairport', (req, res, next) => {
  res.render('createairport');
});
router.post('/createairport', (req, res, next) => {
  connection.query('insert into airport values (?,?)', [req.body.airport_name, req.body.airport_city], (err, results, flds) => {
    if (err) {
      res.render('createairport', {
        user: req.user,
        err: true
      });
    } else {
      res.render('createairport', {
        user: req.user,
        succ: true
      });
    }
  });
});
router.get('/viewbookingagents', (req, res, next) => {
  connection.query("select booking_agent_id, sum(price) total, count(price) value \n" +
    "from (purchases natural join ticket) natural join flight\n" +
    "  where purchase_date <= curdate() and\n" +
    "  purchase_date >= curdate() - interval 12 month and booking_agent_id is not null\n" +
    "group by booking_agent_id\n" +
    "order by sum(price) desc limit 5", (err, results, fields) => {
      if (err) {
        throw err;
      }
      const sortedbytotal = results;

      connection.query("select booking_agent_id, sum(price) total, count(price) value\n" +
        "from (purchases natural join ticket) natural join flight\n" +
        "  where purchase_date <= curdate() and\n" +
        "  purchase_date >= curdate() - interval 1 month and booking_agent_id is not null\n" +
        "group by booking_agent_id\n" +
        "order by count(price) desc limit 5", (err, results, fields) => {
          if (err) {
            throw err;
          }
          const sortedbyonemonth = results;
          connection.query("select booking_agent_id, sum(price) total, count(price) value\n" +
            "from (purchases natural join ticket) natural join flight\n" +
            "  where purchase_date <= curdate() and\n" +
            "  purchase_date >= curdate() - interval 12 month and booking_agent_id is not null\n" +
            "group by booking_agent_id\n" +
            "order by count(price) desc limit 5", (err, results, fields) => {
              if (err) {
                throw err;
              }
              console.log(sortedbytotal, sortedbyonemonth);
              console.log(results);
              res.render('topfivebookingagent', {
                user: req.user,
                sortedbytotal: JSON.stringify(sortedbytotal),
                sortedbycount: JSON.stringify(results),
                sortedbyonemonth: JSON.stringify(sortedbyonemonth)
              });
            });
        });
    });
});
router.get('/viewcustomers', (req, res, next) => {
  connection.query("select customer_email, sum(price) total, count(price) value\n" +
    "from (purchases natural join ticket) natural join flight\n" +
    "  where purchase_date <= curdate() and\n" +
    "  purchase_date >= curdate() - interval 12 month\n" +
    "group by customer_email\n" +
    "order by count(price) desc limit 1", (err, results, fields) => {
      if (err) {
        throw err;
      }
      console.log(results);
      res.render('viewcustomers', {
        user: req.user,
        cust: results[0].customer_email
      });
    });
});
router.post('/viewcustomers', (req, res, next) => {
  connection.query("select airline_name, flight_num, departure_airport, departure_time, arrival_airport, arrival_time, price, status, airplane_id from (purchases natural join ticket) natural join flight where customer_email = ? and airline_name= ?", [req.body.email, req.user.airline_name], (err, results, fields) => {
    if (err) {
      throw err;
    }
    console.log(results);
    res.render('viewcustomers', {
      user: req.user,
      err: (results.length === 0),
      results: results
    });
  });
});
router.get('/reports', (req, res, next) => {
  connection.query("select date_format(purchase_date, '%Y-%m') `date`, sum(price) total, count(price) value\n" +
    "from (purchases natural join ticket) natural join flight\n" +
    "where\n" +
    "  purchase_date <= curdate() and\n" +
    "  purchase_date >= curdate() - interval 30 day\n" +
    "group by date_format(purchase_date, '%Y-%m'), month(purchase_date)\n" +
    "order by `date`", [], (err, results, fields) => {
      if (err) {
        throw err;
      }
      console.log(results);
      res.render('reports', {
        res: JSON.stringify(results)
      });
    });
});
router.post('/reports', (req, res, next) => {
  connection.query("select date_format(purchase_date, '%Y-%m') `date`, count(price) value\n" +
    "from (purchases natural join ticket) natural join flight\n" +
    "where\n" +
    "  purchase_date <= ? and\n" +
    "  purchase_date >= ?\n" +
    "group by date_format(purchase_date, '%Y-%m'), month(purchase_date)\n" +
    "order by `date`", [req.body.end, req.body.begin], (err, results, fields) => {
      if (err) {
        throw err;
      }
      res.render('reports', {
        res: JSON.stringify(results)
      });
    });
});
router.get('/revenue', (req, res, next) => {
  connection.query("select date_format(purchase_date, '%Y') `date`, sum(price) total, count(price) value\n" +
    "from (purchases natural join ticket) natural join flight\n" +
    "where\n" +
    "  purchase_date <= curdate() and\n" +
    "  purchase_date >= curdate() - interval 1 month and booking_agent_id is not null\n" +
    "group by date_format(purchase_date, '%Y'), year(purchase_date)\n" +
    "order by `date`", (err, results, fields) => {
      if (err) throw err;
      const thirtyday = results;
      connection.query("select date_format(purchase_date, '%Y') `date`, sum(price) total, count(price) value\n" +
        "from (purchases natural join ticket) natural join flight\n" +
        "where\n" +
        "  purchase_date <= curdate() and\n" +
        "  purchase_date >= curdate() - interval 1 month and booking_agent_id is null\n" +
        "group by date_format(purchase_date, '%Y'), year(purchase_date)\n" +
        "order by `date`", (err, results, fields) => {
          if (err) throw err;
          const thirtydaynull = results;
          connection.query("select date_format(purchase_date, '%Y') `date`, sum(price) total, count(price) value\n" +
            "from (purchases natural join ticket) natural join flight\n" +
            "where\n" +
            "  purchase_date <= curdate() and\n" +
            "  purchase_date >= curdate() - interval 12 month and booking_agent_id is not null\n" +
            "group by date_format(purchase_date, '%Y'), year(purchase_date)\n" +
            "order by `date`", (err, results, fields) => {
              if (err) throw err;
              const oneyear = results;
              connection.query("select date_format(purchase_date, '%Y') `date`, sum(price) total, count(price) value\n" +
                "from (purchases natural join ticket) natural join flight\n" +
                "where\n" +
                "  purchase_date <= curdate() and\n" +
                "  purchase_date >= curdate() - interval 12 month and booking_agent_id is null\n" +
                "group by date_format(purchase_date, '%Y'), year(purchase_date)\n" +
                "order by `date`", (err, results, fields) => {
                  if (err) throw err;
                  res.render('revenue', {
                    thirtydaynull : JSON.stringify(thirtydaynull),
                    thirtyday: JSON.stringify(thirtyday),
                    oneyearnull: JSON.stringify(results),
                    oneyear : JSON.stringify(oneyear)
                  });
                });
            });
        });
    });
});
router.get('/topdestinations', (req, res, next) => {

});

module.exports = router;