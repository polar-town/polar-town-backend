const User = require("../models/User");

class Guestbook {
  constructor() {
    this.messages = [];
  }

  async initGuestBook(townId) {
    const user = await User.findById(townId);
    this.messages = user.guestBook;
  }

  add(message) {
    this.messages.push(message);
  }
}

module.exports = Guestbook;
