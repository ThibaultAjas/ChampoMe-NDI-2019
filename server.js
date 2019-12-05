const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var check;
db.serialize(function() {

  db.run("CREATE TABLE if not exists user_info (info TEXT)");
  var stmt = db.prepare("INSERT INTO user_info VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
      console.log(row.id + ": " + row.info);
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
