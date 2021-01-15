const http = require('http');
const path = require('path')
const express = require('express');
const socketio = require('socket.io');

//server
const app = express();
const server = http.createServer(app);//it allows us to give the server to socket.io
const io = new socketio.Server(server)//returns a web socket connection
//database
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/chat-database')//database
.then(db => console.log('DataBase is connected'))
.catch(err => console.log(err));

//settings
app.set('port', process.env.PORT || 3000);

//returns the socket
require('./sockets')(io);

//send the file to the client, (static files)
app.use(express.static(path.join(__dirname, 'public')));

//start the server
server.listen(app.get('port'), () => {
    console.log('Server on port',app.get('port'));
})