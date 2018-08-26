const index = require('../index');
const mdLinks = require('../mdlinks');
const path = require('path');

const folder = 'C:\Users\Rav\Documents\Laboratoria\projects\scl-2018-01-FE-markdown\md';

test('mdLinks es un objeto', () => {
  expect(typeof mdLinks).toBe('object');
});
