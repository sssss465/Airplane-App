const mysql = require('mysql');

// $ sudo service mysql stop (or equivalent command)
// $ sudo mysqld_safe --skip-grant-tables --skip-networking &
// $ mysql -u root
// use mysql;
// update user set authentication_string=null, plugin='mysql_native_password' where user='root';
// alter user 'root'@'localhost' identified with mysql_native_password by 'toor'; # mysql ver > 8.0.11
// update user set authentication_string=password('toor') where user='root';      # mysql ver > 5.7
// update user set password=password('toor') where user='root';                   # mysql ver < 5.7
// $ mysqladmin -u root -p shutdown

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'toor',
//   database: 'ticket_sys'
// });
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'airplaneapp'
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('MYSQL connected as id ' + connection.threadId);
});

connection.end(function (err) {
  // The connection is terminated now
  if (err) {
    console.error(err);
  }
});

//exports.db = require('./db');

exports.findById = function (id, cb) {
  process.nextTick(function () {
    // var idx = id - 1;
    // if (records[idx]) {
    //   cb(null, records[idx]);
    // } else {
    //   cb(new Error('User ' + id + ' does not exist'));
    // }
  });
};

//function(err, user)  = cb;
exports.findByUsername = function (username, cb) {
  process.nextTick(function () {
    connection.query('select username, password from airline_staff union select email, password from booking_agent union select email, password from customer', function (err, fields, results) {
      if (err) {
        cb(err, null);
      }
      results.forEach(function (result) {
        if (result === username) {
          return cb(null, result);
        }
      });
    });
    return cb(null, null);
  });
};
