const express = require('express');
const app     = express();
const server  = require('http').createServer(app);
const io      = require('socket.io')(server);


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var check;
db.serialize(function() {
	db.run("CREATE TABLE if not exists User_info (pseudo VARCHAR(20) PRIMARY KEY, passwd VARCHAR(255), role VARCHAR(30))");
  var stmt = db.prepare("INSERT INTO User_info VALUES (pseudo, passwd)");
  for (var i = 0; i < 10; i++) {
      stmt.run("user" + i, "passUser" + i);
  }
  stmt.finalize();

  db.each("SELECT pseudo, passwd FROM User_info", function(err, row) {
      console.log(row.pseudo + ": " + row.passwd);
  });
});

db.close();


app.use(express.static('public'));
app.use('/resources', require('express').static(__dirname + '/node_modules/'));

io.on('connection', function(client) {

	console.log('New user is connected');

	client.on('evt1', function(data) {
		console.log('Chat event');
		console.log(data);
		console.log(data.message);
		client.emit('printLog', "Message reçu");
		io.emit('majChat', data);
	});

});

server.listen(8080, function() {
	console.log('Server running on port 8080');
});
