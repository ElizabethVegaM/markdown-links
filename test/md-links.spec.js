const index = require('../index');
const mdLinks = require('../mdlinks');

const folder = '../README.md';

test('mdLinks es un objeto', () => {
  expect(typeof mdLinks).toBe('object');
});
test('Debería devolver false a una ruta relativa', () => {
  expect(mdLinks.isAbsolute(folder)).toBeFalsy();
});
test('Debería devolver la extensión del archivo', () => {
  expect(mdLinks.checkExtName(folder)).toBe('.md');
});
