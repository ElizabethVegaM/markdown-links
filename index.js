#!/usr/bin/env node

const mdLinks = require('../scl-2018-01-FE-markdown/mdlinks').mdLinks;
const [, , ...args] = process.argv;

if (require.main === module) {
  let options = {};
  if (process.argv.includes('--validate')) options.validate = true;
  mdLinks(process.argv[2], options).then((result) => {
    result.forEach(element => {
      print('Hola');
    });
  }).catch((err) => {
    console.error(err);
  });
};
