class Town {
  constructor(visitor, guestbook) {
    this.visitor = visitor;
    this.guestbook = guestbook;
  }

  addGuestbook(message) {
    this.guestbook.add(message);
  }

  addVisitor(target) {
    this.visitor.join(target);
  }

  removeVisitor(target) {
    this.visitor.leave(target);
  }

  getVisitors() {
    return this.visitor.visitors;
  }

  async getGuestbook(townId) {
    await this.guestbook.initGuestBook(townId);
    return this.guestbook.messages;
  }
}

module.exports = Town;
