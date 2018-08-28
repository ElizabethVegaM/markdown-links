#!/usr/bin/env node

const mdLinks = require('../scl-2018-01-FE-markdown/mdlinks').mdLinks;
const path = require('path');
const [, , ...args] = process.argv;
// en el caso de arriba omite las primeras dos palabras que escribe el usuario en la consola
// por cada espacio se hace un nuevo elemento en process.argv

if (require.main === module) {
  let options = {};
  if (process.argv.includes('--validate')) options.validate = true;
  mdLinks(path.join(process.cwd(), args[0]), options).then((links) => {
    console.log('holi');
    // let link = [];
    // link.push(`{href : ${links.href}, text : ${links.text}}`);  
  }).catch((err) => {
    console.error(err);
  });
};

