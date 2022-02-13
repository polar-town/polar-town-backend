class Visitor {
  constructor() {
    this.visitors = [];
  }

  join(visitor) {
    this.visitors.push(visitor);
  }

  leave(target) {
    this.visitors = this.visitors.filter(
      (visitor) => visitor.email !== target.email
    );
  }
}

module.exports = Visitor;
