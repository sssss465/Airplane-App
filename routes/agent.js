const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const id = req.params.id;
  res.send('respond with a resource');
});
router.get('/flights', function(req, res, next) {
  // view my flights
  res.send('respond with a resource');
});
router.get('/spending', function(req, res, next) {
  // view total spending
  res.send('respond with a resource');
});

module.exports = router;
