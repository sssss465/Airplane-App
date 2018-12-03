const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');

const db = require('./db.js'); // db connection and query file
const index = require('./routes/index');
const users = require('./routes/users'); // ??
const agent = require('./routes/agent');
const customer = require('./routes/customer');
const staff = require('./routes/staff');

const app = express();
const mysql = require('mysql');
const md5 = require('./md5');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'airplaneapp' // airport
});
const connection = pool;
passport.serializeUser(function (user, done) {
  done(null, {'id' : user.id, 'type': user.type});
});
// https://github.com/manjeshpv/node-express-passport-mysql/blob/master/config/passport.js
passport.deserializeUser(function (user, done) {
  console.log("deserializing", user);
  switch(user.type){
    case 'customer': 
    connection.query("SELECT * FROM customer WHERE email = ? ", [user.id], function (err, rows) {
      rows[0].type = user.type;
      return done(err, rows[0]);
    });
      break;
    case 'booking_agent':
    connection.query("SELECT * FROM booking_agent WHERE email = ? ", [user.id], function (err, rows) {
      rows[0].type = user.type;
      return done(err, rows[0]);
    });
      break;
    case 'airline_staff':
    connection.query("SELECT * FROM airline_staff WHERE username = ? ", [user.id], function (err, rows) {
      rows[0].type = user.type;
      return done(err, rows[0]);
    });
      break;
    default:
      done(new Error('no entity type:', user.type), null);
      break;
  }
});

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'
passport.use(
  'local-register',
  new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, username, password, done) {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      console.log('signing up', username, password);
      console.log(req.body.logintype);
      console.log(req.body);
      const q = {"customer": "select email, password from customer where email=?",
                 "booking_agent": "(select email, password from booking_agent where email=?)",
                 "airline_staff": "(select username, password from airline_staff where username=?)" };
      connection.query(q[req.body.logintype], [username], function (err, rows) {
        if (err)
          return done(err);
        if (rows.length) {
          return done(null, false, {'signupMessage': 'That username is already taken.'});
        } else {
          const newUserMysql = {
            id: username,
            type: req.body.logintype,
            // password: bcrypt.hashSync(password, 3) // use the generateHash function in our user model
            password: md5(password)
          };
          const user = {}; // for insert
          if (req.body.logintype === "airline_staff"){
            user.username = req.body.email;
            user.password = newUserMysql.password;
            user.first_name = username;
            user.last_name = username; // lol
            user.date_of_birth = req.body.dob;
            user.airline_name = "United";
          } else if (req.body.logintype === "booking_agent"){
            user.email = req.body.email;
            user.password = newUserMysql.password;
            user.booking_agent_id = Math.random().toString(36).substr(2, 5);
          } else {
            user.email = req.body.email;
            user.name = req.body.password;
            user.password = newUserMysql.password;
            user.building_number = req.body.bldn;
            user.street = req.body.street;
            user.city = req.body.city;
            user.state = req.body.state;
            user.phone = req.body.phone;
            user.state = req.body.state;
            user.passportnumber = req.body.passportnumber;
            user.exp = req.body.exp;
            user.passportcountry = req.body.passportcountry;
            user.date_of_birth = req.body.dob;
          }
          console.log(user);
          let insertQuery = "INSERT INTO " + req.body.logintype;
          const values = Object.values(user).filter(v => v !== '');// no empty fields
          insertQuery += " values (";
          for (let i = 0; i < values.length; i++){
            if (i === values.length-1) {insertQuery += "?)"; break;}
            insertQuery += "?, ";
          }
          console.log(insertQuery, values);
          connection.query(insertQuery, values, function (err, rows) {
            if (err) throw err;
            console.log("succesfully added", user);
            return done(null, newUserMysql); // for application
          });
        }
      });
    })
);

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use(
  'local-login',
  new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, username, password, done) { // callback with email and password from our form
      console.log('login strat hit');
      console.log(username, password);
      const q = {"customer": "select email, password from customer where email=?",
                 "booking_agent": "(select email, password from booking_agent where email=?)",
                 "airline_staff": "(select username, password from airline_staff where username=?)" };
      connection.query(q[req.body.logintype], [username], function (err, rows) {
        if (err)
          {return done(err);}
        if (!rows.length) {
          return done(null, false, {'loginMessage': 'No user found.'}); // req.flash is the way to set flashdata using connect-flash
        }
        // if the user is found but the password is wrong
        if (rows[0].password !== md5(password)){
          return done(null, false, {'loginMessage': 'Oops! Wrong password.'});
        } // create the loginMessage and save it to session as flashdata
        console.log("succesful login!!! :D");
        // all is well, return successful user
        return done(null, {id: username, type: req.body.logintype});
      });
    })
);
app.set('pool', pool); // mysql pooled connection, populates in app.req.pool or app.res.pool
require('./db.js'); // db connection and schema file

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser('keyboard cat'));

app.use(session({
  secret: 'keyboard cats',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/booking_agent', agent);
app.use('/customer', customer);
app.use('/airline_staff', staff);

app.use('/test', function (req, res, next) {
  res.send(db.findByUsername('jana'));
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;