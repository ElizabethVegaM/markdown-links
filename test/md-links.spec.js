const index = require('../index');
const mdLinks = require('../mdlinks');

const relativeFolder = '../README.md';
const absoluteFolder = 'C:/Users/Rav/Documents/Laboratoria/projects/scl-2018-01-FE-markdown/files/conLinks.md';

test('mdLinks es un objeto', () => {
  expect(typeof mdLinks).toBe('object');
});
test('Debería devolver false a una ruta relativa', () => {
  expect(mdLinks.isAbsolute(relativeFolder)).toBeFalsy();
});
test('Debería devolver true a una ruta absoluta', () => {
  expect(mdLinks.isAbsolute(absoluteFolder)).toBeTruthy();
});
