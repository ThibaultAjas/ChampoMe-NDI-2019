const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const session = require('express-session');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.db');

// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }));

app.use(express.static('public'));
app.use('/resources', require('express').static(__dirname + '/node_modules/'));

io.on('connection', function(client) {

  // Comparer les infos à la BD

  console.log('New user is connected');

  client.on('evtConnexion', function(data) {
    console.log('Session evt');

    db.serialize(function() {

      let sql = 'SELECT pseudo FROM User_info WHERE pseudo=? AND passwd=?';

      db.all(sql, [data.pseudo, data.passwd], function(err, rows) {
        if (err) {
          return console.error(err.message);
        }
        console.log("data:");
        console.log(data);
        console.log("rows");
        console.log(rows);
      });
    });

  });
  // Si c'est correct, lancer la session

  client.on('evt1', function(data) {
    console.log('Chat event');
    console.log(data);
    console.log(data.message);
    client.emit('printLog', "Message reçu");
    io.emit('majChat', data);
  });

  // Sinon dire au client d'aller se faire foutre
  db.close();
});

server.listen(8080, function() {
  console.log('Server running on port 8080');
});
