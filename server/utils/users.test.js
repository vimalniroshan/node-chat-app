const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

  var users;

  beforeEach(() => {
    users = new Users();

    users.users = [{
        id: '1',
        name: 'Name1',
        room: 'room1'
      }, {
        id: '2',
        name: 'Name2',
        room: 'room2'
      }, {
        id: '3',
        name: 'Name3',
        room: 'room1'
      }
    ];

  });

  it('should add new user', () => {
    var user = {
      id: 'some-id',
      name: 'some-name',
      room: 'some-room'
    };

    var addedUser = users.addUser(user.id, user.name, user.room);

    expect(addedUser).toEqual(user);
    expect(users.users.length).toEqual(4);
    expect(users.users).toInclude(user);
  });

  it('should remove a user', () => {
    var userId = '1';
    var removedUser = users.removeUser(userId);

    expect(removedUser.id).toEqual(userId);
    expect(users.users.length).toEqual(2);
  });

  it('should not remove a user', () => {
    var userId = '99';
    var removedUser = users.removeUser(userId);

    expect(removedUser).toNotExist();
    expect(users.users.length).toEqual(3);
  });

  it('should find a user', () => {
    var userId = 1;
    var user = users.getUser(userId);

    expect(user).toEqual(user);
  });

  it('should not find a user', () => {
    var userId = 99;
    var user = users.getUser(userId);

    expect(user).toNotExist();
  });

  it('should return names in the roome "room1"', () => {
    var userList = users.getUserList('room1');

    expect(userList).toEqual(['Name1', 'Name3']);
  });

  it('should return names in the roome "room2"', () => {
    var userList = users.getUserList('room2');

    expect(userList).toEqual(['Name2']);
  });
});
