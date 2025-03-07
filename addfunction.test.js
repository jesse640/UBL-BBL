const add = require('./addfunction')

test('check add function works properly', () => {
  expect(add(2, 3)).toBe(5);
});

test('adds -1 + 1 to equal 0', () => {
  expect(add(-1, 1)).toBe(0);
});

test('add 5 and 6', () => {
  expect(add(5, 6)).toBe(11);
});

// to run test use "npm test"