const io = require('socket.io');
const express = require('express');
const app = express.createServer();
// const app = express();
// const server = require('http').createServer(app);

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.db');

app.use(express.static('public'));
app.use('/resources', require('express').static(__dirname + '/node_modules/'));


app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.session({secret: 'secret', keys: 'express.sid'}));
  app.use(function(req, res) {
    res.end('<h2>Hello, your session id is ' + req.sessionID + '</h2>');
  });
});

app.listen();
var sio = io.listen(app);
sio.socket.on('connection', function(client) {
  console.log('New user is connected');
});


// io.on('connection', function(client) {
//   // Comparer les infos à la BD
//   console.log('New user is connected');
//   client.on('evtConnexion', function(data) {
//     console.log('Session evt');
//
//     db.serialize(function() {
//       let sql = 'SELECT pseudo FROM User_info WHERE pseudo=? AND passwd=?';
//       db.all(sql, [data.pseudo, data.password], function(err, rows) {
//
//         if (err) {
//           return console.error(err.message);
//         }
//
//         if (rows.length == 1) { // La combinaison pseudo/password existe dans la DB
//           // On crée une session
//           console.log("test");
//           console.log(data);
//         } // Sinon on ne crée pas de session
//       });
//     });
//
//   });
//
//   client.on('evt1', function(data) {
//     io.emit('majChat', data);
//   });
//
// });

// server.listen(8080, function() {
//   console.log('Server running on port 8080');
// });
