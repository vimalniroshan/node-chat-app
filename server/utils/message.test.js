const expect = require('expect');

var {generateMessage} = require('./message.js');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var message = generateMessage('test', 'testmessage');

    expect(message.from).toBe('test');
    expect(message.text).toBe('testmessage');
    expect(message.createdAt).toBeA('number');
  });
});
