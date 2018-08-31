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
    links.map(element => {
      if (options.validate) {
        fetch(element.href)
          .then(res => {
            result.push({
              href: element.href, 
              text: element.text, 
              file: element.file,
              line: element.line,
              status: res.status,
              ok: res.ok
            });
            console.log(result);
          }).catch(err => {
            console.error(err)
          });
      } else {
        result.push({
          href: element.href, 
          text: element.text, 
          file: element.file,
          line: element.line
        });
      }
    });
    if (options.stats) {
      result.push({
        totals: result.length,
        sucess: 'links que estan con estado ok',
        failure: 'links que fallaron validacion'
      });
    }
    console.log(result);
  }).catch((err) => {
    console.error(err);
  });
};


