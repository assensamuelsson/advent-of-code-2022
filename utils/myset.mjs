export default class MySet extends Set {

  union (other) {
    return new MySet([...other, ...this.values()]);
  }

  intersection (other) {
    return new MySet([...other].filter((x) => this.has(x)));
  }

  difference (other) {
    return new MySet([...this].filter((x) => !other.has(x)));
  }
  
  symmetricDifference (other) {
    return this.difference(other).union(other.difference(this));
  }
};