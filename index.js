#!/usr/bin/env node

const mdLinks = require('../scl-2018-01-FE-markdown/mdlinks').mdLinks;
const path = require('path');
const fetch = require('node-fetch');
const [, , ...args] = process.argv;
const colors = require('colors');
// en el caso de arriba omite las primeras dos palabras que escribe el usuario en la consola
// por cada espacio se hace un nuevo elemento en process.argv

if (require.main === module) {
  let options = {};
  if (process.argv.includes('--validate')) options.validate = true;
  if (process.argv.includes('--stats')) options.stats = true;
  mdLinks(path.join(process.cwd(), args[0]), options).then((links) => {
    let result = '';
    let successCounter = 0;
    let failCounter = 0;
    links.map(element => {
      fetch(element.href)
        .then(res => {
          if (options.validate) {
            result = (`${element.file}: ${element.line} - ${colors.magenta(element.href)} - ${element.text} ${colors.green(res.status)} ${colors.green(res.ok)}`);
          } else {
            result = (`${colors.grey(element.file)}: ${colors.grey(element.line)} - ${colors.cyan(element.href)} - ${element.text}`);
          }
          if (options.stats) {
            if (res.ok === true) {
              successCounter++;
            } else if (res.ok === false) {
              failCounter++;
            }
            stats = (`${colors.cyan('totals: ')} ${colors.cyan(links.filter(link => link.href).length)}, ${colors.green('success: ')} ${colors.green(successCounter)}, ${colors.red('failed: ')} ${colors.red(failCounter)}`);
          }
          console.log(result);
          if (options.stats) console.log(stats);
          console.log(colors.green('hello'));
        })
        .catch(err => {
          console.error(err);
        });
    });
  }).catch((err) => {
    console.error(err);
  });
};
