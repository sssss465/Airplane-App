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
      'viewbookingagents': "Create new airports",
      'viewcustomers': "Create new airports",
      'revenue': "Create new airports",
      'topdestinations': "Create new airports",
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

});
router.post('/createairport', (req, res, next) => {

});
router.get('/viewbookingagents', (req, res, next) => {

});
router.get('/viewcustomers', (req, res, next) => {

});
router.get('/revenue', (req, res, next) => {

});
router.get('/topdestinations', (req, res, next) => {

});

module.exports = router;