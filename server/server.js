const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');


  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room are required');
    }

    socket.join(params.room);
    var removedUser = users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    if(removedUser) {
        io.to(removedUser.room).emit('updatedUserList', users.getUserList(removedUser.room));
    }
    io.to(params.room).emit('updatedUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin','Welcome to chat app.'));
    socket.broadcast
      .to(params.room)
      .emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('Create message:', message);
    callback('Server');
    io.emit('newMessage', generateMessage(message.from, message.text));
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocation', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
    var removedUser = users.removeUser(socket.id);
    if(removedUser) {
        io.to(removedUser.room).emit('updatedUserList', users.getUserList(removedUser.room));
        io.to(removedUser.room).emit('newMessage', generateMessage('Admin', `${removedUser.name} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Started server on port ${port}`);
});
