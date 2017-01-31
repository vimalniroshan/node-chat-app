const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message.js');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'test';
    var text = 'testmessage';

    var message = generateMessage(from, text);

    expect(message).toInclude({from, text});
    expect(message.createdAt).toBeA('number');
  });
});


describe('generateLocationMessage', () => {
  it('should generate correct location message object', () => {
    var from = 'test';
    var latitude = 34.6757;
    var longitude = -54.435435;
    var url = `https://www.google.com/maps?q=${latitude},${longitude}`;

    var message = generateLocationMessage(from, latitude, longitude);

    expect(message).toInclude({from, url});
    expect(message.createdAt).toBeA('number');
  });
});
