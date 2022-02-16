const User = require("../models/User");

class Guestbook {
  constructor() {
    this.messages = [];
  }

  async initGuestBook(townId) {
    try {
      const user = await User.findById(townId);
      this.messages = user.guestBook;
      return this.messages;
    } catch (error) {
      console.error(error);
    }
  }

  add(message) {
    this.messages.push(message);
    return this.messages;
  }
}

module.exports = Guestbook;
