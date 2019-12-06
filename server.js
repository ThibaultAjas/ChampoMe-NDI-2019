const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-parser');
const session = require('express-session');
const uuid = require('uuid/v4');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.db');

app.use(express.static('public'));
app.use('/resources', require('express').static(__dirname + '/node_modules/'));


app.use(cookieParser());
app.use(session({
  secret: 'secret',
  keys: 'express.sid'
}));

app.use(function(req, res) {
  res.end('<h2>Hello, your session id is ' + req.sessionID + '</h2>');
  console.log(req.sessionID);
});

io.set('authorization', function(data, accept) {
  // check if there's a cookie header
  if (data.headers.cookie) {
    // if there is, parse the cookie
    data.cookie = cookieParser(data.headers.cookie);
    // note that you will need to use the same key to grad the
    // session id, as you specified in the Express setup.
    data.sessionID = data.cookie['express.sid'];
  } else {
    // if there isn't, turn down the connection with a message
    // and leave the function.
    return accept('No cookie transmitted.', false);
  }
  // accept the incoming connection
  accept(null, true);
});

io.on('connection', function(client) {
  console.log('New user is connected');
  console.log('A socket with sessionID ' + client.handshake.sessionID + ' connected!');
});


server.listen(8080, function() {
  console.log('Server running on port 8080');
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
