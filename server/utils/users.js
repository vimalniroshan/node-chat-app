class Users {
  constructor () {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = {id, name, room};
    this.users.push(user);

    return user;
  }

  removeUser(id) {
    var userToBeRemoved = this.getUser(id);

    if(userToBeRemoved) {
      this.users = this.users.filter(user => user.id !== userToBeRemoved.id);
    }

    return userToBeRemoved;
  }

  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }

  getUserList(room) {
      var users = this.users.filter(user => user.room === room);
      return users.map(user => user.name);
  }
}

module.exports = {Users};
