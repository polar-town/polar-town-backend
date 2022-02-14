class Visitor {
  constructor() {
    this.visitors = [];
  }

  join(visitor) {
    this.visitors.push(visitor);
  }

  leave(target) {
    const updatedVisitors = this.visitors.filter(
      (visitor) => visitor.email !== target.email
    );

    this.visitors = updatedVisitors;
    return updatedVisitors;
  }

  findDuplicate(target) {
    return this.visitors.some((visitor) => visitor.email === target.email);
  }
}

module.exports = Visitor;
