const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const session = require('express-session');
const cookieParser = require('cookie-parser');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.db');

var sess = {
  genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },
  secret: 'L\'ennui de l\'info 2019',
  pseudo: '',
  cookie: {
    secure: true,
    maxAge: 600000 // En ms
  }
}

// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }));

app.use(express.static('public'));
app.use('/resources', require('express').static(__dirname + '/node_modules/'));
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));

app.get('/', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
});

io.on('connection', function(client) {

  // Comparer les infos à la BD

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
          sess.pseudo = data.pseudo;
          console.log(data);
        } // Sinon on ne crée pas de session
      });
    });

  });

  client.on('evt1', function(data) {
    console.log(sess);
    io.emit('majChat', data);

    /*
      app.get('/', function(req, res, next) {
        console.log("app.get()");
        // if (req.session.views) {
          // Si la session existe:
          console.log(data);
          // data.pseudo = req.session.pseudo;
          console.log(data);
          io.emit('majChat', data);
        // } // Sinon:
      });*/
  });

});

server.listen(8080, function() {
  console.log('Server running on port 8080');
});
