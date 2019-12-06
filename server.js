const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const session = require('express-session');
const cookieParser = require('cookie-parser');

const uuid = require('uuid/v4');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.db');

// add & configure middleware
app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return uuid() // use UUIDs for session IDs
  },
  secret: "L'ennui de l'info",
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public'));
app.use('/resources', require('express').static(__dirname + '/node_modules/'));

app.get('/', function(req, res){
  console.log('app.get()');
  console.log(req.sessionID)
});

io.on('connection', function(client) {
  // Comparer les infos à la BD
  // const uniqueId = uuid();
  console.log('New user is connected');
  client.on('evtConnexion', function(data) {
    console.log('Session evt');

    db.serialize(function() {
      let sql = 'SELECT pseudo FROM User_info WHERE pseudo=? AND passwd=?';
      db.all(sql, [data.pseudo, data.password], function(err, rows) {

        if (err) {
          return console.error(err.message);
        }

        if (rows.length == 1) { // La combinaison pseudo/password existe dans la DB
          // On crée une session
          console.log("test");
          console.log(data);
        } // Sinon on ne crée pas de session
      });
    });

  });

  client.on('evt1', function(data) {
    io.emit('majChat', data);
  });

});

server.listen(8080, function() {
  console.log('Server running on port 8080');
});
