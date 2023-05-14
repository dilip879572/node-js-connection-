var mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database:'task'
});
 
connection.connect();

module.exports=connection; 