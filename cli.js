#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const index = require('../scl-2018-01-FE-markdown/index');

// Lee los archivos que se encuentran en la carpeta seleccionada
fs.readdir(process.argv[2], 'utf8', function(err, files) {
  if (err) throw err;
  console.log(files);
  for (let i = 0; i < files.length; i++) {
    if (path.extname(files[i]) === '.md') {
      console.log(files[i]);
      fs.readFile(`${files[i]}`, 'utf8', (err, data) => {
        if (err) throw err;
        index.mdLinks(data);
      });
    }
  }
});

