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

exports.findByUsername = function (username, cb) {
  process.nextTick(function () {
    connection.query('select username, password from staff union select email, password from agent', function (err, results, fields) {
      if (err) {
        throw err;
      }
      console.log(results.toString());
      fields.forEach(function (field) {
        console.log(field.toString());
        if (field === username) {
          return cb(null, field);
        }
      });
    });

    // for (var i = 0, len = records.length; i < len; i++) {
    //   var record = records[i];
    //   if (record.username === username) {
    //     return cb(null, record);
    //   }
    // }
    return cb(null, null);
  });
};
