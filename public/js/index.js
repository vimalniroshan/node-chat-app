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

socket.on('newLocation', function(message) {
  var li = $('<li></li>');
  var a = $('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
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

var locationButton = $('#send-location');

locationButton.on('click', function(e) {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, function(ack) {});
  }, function() {
    alert('Unable to access location');
  });
});
