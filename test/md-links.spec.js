const index = require('../index');
const mdLinks = require('../mdlinks');

const relativeFolder = '../README.md';

test('mdLinks es un objeto', () => {
  expect(typeof mdLinks).toBe('object');
});
test('Debería devolver false a una ruta relativa', () => {
  expect(mdLinks.isAbsolute(relativeFolder)).toBeFalsy();
});