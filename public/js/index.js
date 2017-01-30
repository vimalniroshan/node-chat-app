var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('newMessage', function(message) {
  console.log('Received a message', message);
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  $('#messages').append(li);
});

socket.on('disconnect', function() {
  console.log('Lost connection to server');
});

socket.emit('createMessage', {
  from: 'Nirosh',
  text: 'Hi'
}, function(ack) {
  console.log('Reached', ack);
});

$('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val()
  }, function(ack) {});
});
