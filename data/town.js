class Town {
  constructor(visitor, guestbook) {
    this.visitor = visitor;
    this.guestbook = guestbook;
  }

  async addGuestbook(townId, message) {
    try {
      if (!this.guestbook.messages.length) {
        const messages = await this.guestbook.initGuestBook(townId);
        return messages;
      }

      return this.guestbook.add(message);
    } catch (error) {
      console.error(error);
    }
  }

  addVisitor(target) {
    if (this.visitor.findDuplicate(target)) return;
    this.visitor.join(target);
  }

  removeVisitor(target) {
    return this.visitor.leave(target);
  }

  getVisitors() {
    return this.visitor.visitors;
  }
}

module.exports = Town;
