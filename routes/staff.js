const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('splash', { user : req.user,
    action: {"flights": "View your booked customer flights",
                                  "commission": "View your commission",
                                'topcustomers': "View top five customers based on ticket quantity and ticket sales"}});
});

router.get('/createflight', (req, res, next) => {

});
router.post('/createflight', (req, res, next) => {

});
router.get('/createplane', (req, res, next) => {

});
router.post('/createplane', (req, res, next) => {

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
