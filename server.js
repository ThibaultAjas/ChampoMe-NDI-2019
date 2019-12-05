const express = require('express');
const app     = express();
const server  = require('http').createServer(app);
const io      = require('socket.io')(server);

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

