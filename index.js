#!/usr/bin/env node

const mdLinks = require('../scl-2018-01-FE-markdown/mdlinks').mdLinks;
const [, , ...args] = process.argv;

if (require.main === module) {
  let options = {};
  if (process.argv.includes('--validate')) options.validate = true;
  mdLinks(process.argv[2], options).then((result) => {
    for (let i = 0; i < files.length; i++) {
      console.log(result);
    }
  }).catch((err) => {
    console.error(err);
  });
};

// // Lee los archivos que se encuentran en la carpeta seleccionada
// fs.readdir(process.argv[2], 'utf8', function(err, files) {
//   if (err) throw err;
//   console.log(files);
//   for (let i = 0; i < files.length; i++) {
//     if (path.extname(files[i]) === '.md') {
//       console.log(files[i]);
//       fs.readFile(`${files[i]}`, 'utf8', (err, data) => {
//         if (err) throw err;
//         index.mdLinks(data);
//       });
//     }
//   }
// });