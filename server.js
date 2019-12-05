const express = require('express');
const app     = express();
const server  = require('http').createServer(app);
const io      = require('socket.io')(server);


app.use(express.static('public'));

app.use('/resources', require('express').static(__dirname + '/node_modules/'));

io.on('connection', function(client) {
	console.log('New user is connected');
	client.emit('greeting', {id:0, time: new Date()});
	//io.emit()
});

io.on('clickEvent', function(data) {
	console.log(data);
	io.emit('greeting', [0,1,2,3]);
});

server.listen(8080);


/*
app.listen(8080, function() {
	console.log('Server up and running on port 8080');
});
*/
