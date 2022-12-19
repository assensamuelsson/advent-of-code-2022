const fibrec = (n) => {
  if (n < 2) return 1;
  return fibrec(n - 1) + fibrec(n - 2);
}

const fibdp = (n, lookup = new Map()) => {
  if (lookup.has(n)) return lookup.get(n);
  else if (n < 2) return 1;
  lookup.set(n, fibdp(n - 1, lookup) + fibdp(n - 2, lookup));
  return lookup.get(n);
}

const s1 = new Date().getTime();
console.log(fibrec(40))
console.log('Recursive took', new Date().getTime() - s1, 'ms');

const s2 = new Date();
console.log(fibdp(10))
console.log('DP took', (new Date()).getTime() - s2.getTime(), 'ms');