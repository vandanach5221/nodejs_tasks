// var config = {
// 	database: {
// 		host: 'localhost',
// 		user: 'root1',
// 		password: '',
// 		port: 3306,
// 		db: 'nodejs_tasks'
// 	},
// 	server:{
// 		host: '127.0.0.1',
// 		port: '3000'
// 	}
// }


var mysql = require('mysql');
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
	database: 'nodejs_tasks'
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});













module.exports = conn