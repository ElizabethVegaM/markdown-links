#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const [, , ...args] = process.argv;


// Lee los archivos que se encuentran en la carpeta seleccionada
fs.readdir(`${args}`, function(err, files) {
  if (err) throw err;
  console.log(files);
  for (let i = 0; i < files.length; i++) {
    if (path.extname(files[i]) === '.md') {
      fs.readFile(`${files[i]}`, 'utf8', (err, data) => {
        if (err) throw err;
        mdLinks(data);
      });
    }
  }
});

