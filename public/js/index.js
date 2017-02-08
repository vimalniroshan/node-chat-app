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

var messageTextbox = $('[name=message]');

$('#message-form').on('submit', function(e) {
  e.preventDefault();

  var message = messageTextbox.val();

  if(message === '') {
    return;
  }

  socket.emit('createMessage', {
    from: 'User',
    text: message
  }, function(ack) {
      messageTextbox.val('');
  });
});

var locationButton = $('#send-location');

locationButton.on('click', function(e) {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Send location');

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to access location');
  });
});
