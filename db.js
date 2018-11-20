const mysql = require('mysql');
// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database: 'airport'
// });
// connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
//   console.log('connected as id ' + connection.threadId);
// });

// connection.query('select * from airplane', function (error, results, fields) {
//     if (error) {throw error;}
//     // connected!
//     console.log(results);
//     fields.forEach(function (field) {
//         console.log(field.name);
//     });
//   });

// connection.end(function(err) {
//     // The connection is terminated now
//     if (err){
//         console.error(err);
//     }
// });
