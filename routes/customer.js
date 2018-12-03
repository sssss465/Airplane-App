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
  connection.query('select * from purchases ', (error, results, fields) => {
    if (error) {
      throw error;
    }
    console.log(results);
  });
  next();
});

module.exports = router;
