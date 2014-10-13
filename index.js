var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1337;


http.listen(port, function (){
	console.log('listening on *:'+port);
});

//Routing
app.use(express.static(__dirname + '/public'));

var Room = io
	.of('/room')
	.on('connection', function (socket) {
		/* Lui */
		console.log('someone have join');
		var joinedRoom = null;
		/* Demande et changement de Room */
		socket.on('join room', function (data) {
			socket.join(data);
			joinedRoom = data;
			/* Pour lui */
			socket.emit('joined', 'you\'ve joined ' + data);
			/* Pour les autres */
			socket.broadcast.to(joinedRoom).send('someone joined room');
		});

		/* Reception et distribution du message */
		socket.on('fromclient', function (data) {
			if (joinedRoom) {
				/* Juste pour les autres */
				socket.broadcast.to(joinedRoom).send(data);
			}else{
				/* Pour lui */
				socket.send("you're not joined a room." + "select a room and then push join.");
			}
		});
	});


console.log("Express server listening");