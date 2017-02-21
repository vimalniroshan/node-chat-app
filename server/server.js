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
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback('Server');
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if(user) {
      io.to(user.room)
        .emit('newLocation', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
    var removedUser = users.removeUser(socket.id);
    if(removedUser) {
        io.to(removedUser.room)
          .emit('updatedUserList', users.getUserList(removedUser.room));
        io.to(removedUser.room)
          .emit('newMessage', generateMessage('Admin', `${removedUser.name} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Started server on port ${port}`);
});
