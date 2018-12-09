const express = require('express');
const router = express.Router();
const connection = require('../db');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('splash', {
    user: req.user,
    action: {
      "flights" : "Show upcoming flights owned by airline", // not sure if right
      "createflight": "Create new flights AND change flight status", //todo
      "createplane": "Create new planes",
      'createairport': "Create new airports",
      'viewbookingagents': "View booking agents",
      'viewcustomers': "View customers",
      'reports': "Total amount of tickets sold given range of dates",
      'revenue': "Revenue from direct vs indirect sales",
      'topdestinations': "3 most popular destinations for last 3 monts and last yr" //todo
    }
  });
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
router.get('/createflight', (req, res, next) => {
  // 5. Create new flights: He or she creates a new flight, providing all the needed data, via forms. The application should prevent unauthorized users from doing this action. Defaults will be showing all the upcoming flights operated by the airline he/she works for the next 30 days.
  connection.query('select * from flight where airline_name=?', [req.user.airline_name], (err, results, fields) => {
    if (err) throw err;
    res.render('createflight', {user: req.user, res : results});
  });
});
router.post('/createflight', (req, res, next) => {
  console.log(req.body);
  const { airport_name, flight_num, departure_airport,
  departure_time, arrival_airport, arrival_time, price, status, airplane_id,} = req.body;
  connection.query('insert into flight values (?,?,?,?,?,?,?,?,?)', [airport_name,flight_num, departure_airport, departure_time, arrival_airport, arrival_time, price, status, airplane_id], (err, results, fields) => {
    if (err) res.render('createflight', {user : req.user, err : true});
    else res.redirect('createflight');
  });
});
router.post('/changestatus', (req, res, next) => {
  console.log(req.body);
  const {flight_num} = req.body;
  let [num, status] = flight_num.split(' ');
  if (status === 'upcoming') status = 'in-progress';
  else if (status === 'in-progress') status = 'delayed';
  else status = 'upcoming';
  connection.query('update flight set status=? where flight_num =?', [status, num], (err, results, fields) => {
    if (err) res.render('createflight', {user : req.user, err : true});
    else res.redirect('createflight');
  });
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
  res.render('createairport', {user: req.user});
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
        user: req.user,
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
        user: req.user,
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
                    user: req.user,
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
  connection.query('select arrival_airport, count(ticket_id) from (purchases natural join ticket) natural join flight where purchase_date <= curdate() and purchase_date >= curdate() - interval 3 month group by arrival_airport order by count(ticket_id) desc limit 3', (err, results, fields) => {
    if (err) throw err;
    const topthree = results;
    connection.query('select arrival_airport, count(ticket_id) from (purchases natural join ticket) natural join flight where purchase_date <= curdate() and purchase_date >= curdate() - interval 12 month group by arrival_airport order by count(ticket_id) desc limit 3', (err, results, fields) => {
      if (err) throw err;
      res.render('topdestinations', {user: req.user, topthree: topthree, topyear : results});
    });
  });
});

module.exports = router;