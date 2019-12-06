const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));
app.use('/resources', require('express').static(__dirname + '/node_modules/'));

io.on('connection', function(client) {
  console.log('New user is connected');

  client.on('evtConnexion', function(data) {
    console.log('Session evt');
    // Comparer les infos à la BD
    db.serialize(function() {
      let sql = 'SELECT pseudo FROM User_info WHERE pseudo=? AND passwd=?';
      db.all(sql, [data.pseudo, data.password], function(err, rows) {
        if (err) {
          return console.error(err.message);
        }
        if (rows.length == 1) { // La combinaison pseudo/password existe dans la DB
          // On est censé créer une session
          console.log("test");
          console.log(data);
        } // on est censé ne pas en céer (et de toute façon on en crée pas, doc c'est plutot bien réussi pour cette partie)
      });
    });
  });

  client.on('evt1', function(data) {
    // Dès qu'un message est reçu par le serveur, on le transmet à tous les clients
    io.emit('majChat', data);
    console.log(data);
  });

});

server.listen(8080, function() {
  console.log('Server running on port 8080');
});
