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

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'airplaneapp'
});

// connection.on('connection', function (connection) {
//   connection.on('enqueue', function (sequence) {
//     // if (sequence instanceof mysql.Sequence.Query) {
//     if ('Query' === sequence.constructor.name) {
//       console.log(sequence.sql);
//     }
//   });
// });

module.exports = connection;
