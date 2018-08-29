#!/usr/bin/env node

const mdLinks = require('../scl-2018-01-FE-markdown/mdlinks').mdLinks;
const path = require('path');
const [, , ...args] = process.argv;
// en el caso de arriba omite las primeras dos palabras que escribe el usuario en la consola
// por cada espacio se hace un nuevo elemento en process.argv

if (require.main === module) {
  let options = {};
  if (process.argv.includes('--validate')) options.validate = true;
  if (process.argv.includes('--stats')) options.stats = true;
  mdLinks(path.join(process.cwd(), args[0]), options).then((links) => {
    let result = [];
    links.map(element => {
      result.push({
        href: element.href, 
        text: element.text, 
        file: element.file,
      });
      if (options.validate = true) {
        result.push({
          status: 'holi',
        });
      }
    });
    console.log(result);
  }).catch((err) => {
    console.error(err);
  });
};

