const mdLinks = require('../scl-2018-01-FE-markdown/mdlinks').mdLinks;
const path = require('path');
const fetch = require('node-fetch');
const [, , ...args] = process.argv;
// en el caso de arriba omite las primeras dos palabras que escribe el usuario en la consola
// por cada espacio se hace un nuevo elemento en process.argv

if (require.main === module) {
  let options = {};
  if (process.argv.includes('--validate')) options.validate = true;
  if (process.argv.includes('--stats')) options.stats = true;
  mdLinks(path.join(process.cwd(), args[0]), options).then((links) => {
    let result = [];
    let successCounter = 0;
    let failCounter = 0;
    links.map(element => {
      fetch(element.href)
        .then(res => {
          if (options.validate) {
            result.push({
              href: element.href, 
              text: element.text, 
              file: element.file,
              line: element.line,
              status: res.status,
              ok: res.ok
            });
          } else {
            result.push({
              href: element.href, 
              text: element.text, 
              file: element.file,
              line: element.line
            });
          }
          if (options.stats) {
            if (res.ok === true) {
              successCounter++;
            } else if (res.ok === false) {
              failCounter++;
            }
            result.push({
              totals: links.filter(link => link.href).length,
              success: successCounter,
              failure: failCounter
            });
          }
          console.log(result);
        }).then(res => {
          
        })
        .catch(err => {
          console.error(err);
        });
    });
  }).catch((err) => {
    console.error(err);
  });
};
