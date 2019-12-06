const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-parser');
const Session = require('express-session');
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
  // res.end('<h2>Hello, your session id is ' + req.sessionID + '</h2>');
  console.log(req.sessionID);
});

// var Session = require('connect').middleware.session.Session;

io.set('authorization', function(data, accept) {
  if (data.headers.cookie) {
    data.cookie = parseCookie(data.headers.cookie);
    data.sessionID = data.cookie['express.sid'];
    // save the session store to the data object
    // (as required by the Session constructor)
    data.sessionStore = sessionStore;
    sessionStore.get(data.sessionID, function(err, session) {
      if (err || !session) {
        accept('Error', false);
      } else {
        // create a session object, passing data as request and our
        // just acquired session data
        data.session = new Session(data, session);
        accept(null, true);
      }
    });
  } else {
    return accept('No cookie transmitted.', false);
  }
});

io.on('connection', function(client) {
  var hs = client.handshake;
  console.log('A socket with sessionID ' + hs.sessionID +
    ' connected!');
  // setup an inteval that will keep our session fresh
  var intervalID = setInterval(function() {
    // reload the session (just in case something changed,
    // we don't want to override anything, but the age)
    // reloading will also ensure we keep an up2date copy
    // of the session with our connection.
    hs.session.reload(function() {
      // "touch" it (resetting maxAge and lastAccess)
      // and save it back again.
      hs.session.touch().save();
    });
  }, 60 * 1000);
  client.on('disconnect', function() {
    console.log('A socket with sessionID ' + hs.sessionID +
      ' disconnected!');
    // clear the socket interval to stop refreshing the session
    clearInterval(intervalID);
  });

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
