const fs = require('fs');
const path = require('path');
const Marked = require('marked');
// para validar urls
// const fetch = require('node-fetch');
let mdLinks = {};
let validate = false;

// 
// path.resolve(_yourPath) === path.normalize(_yourPath).replace(/[\/|\\]$/, '')

mdLinks.mdLinks = (myPath, options) => {
  return new Promise((resolve, reject) => {
    if (options.validate) validate = true;
    if (!myPath) console.log('Debe ingresar un archivo directorio');
    let isAbsolute = path.resolve(myPath) === path.normalize(myPath).replace(/[\/|\\]$/, '');
    if (isAbsolute === false) {
      let resolvedPath = path.resolve(myPath);
      if (mdLinks.isFileOrDirectory(resolvedPath) === 'directory') {
        mdLinks.isDirectory(resolvedPath).then((response) => {
          resolve(response);
        }).catch((err) => {
          console.error(err);
        });
      } else if (mdLinks.isFileOrDirectory(resolvedPath) === 'file') {
        for (let i = 0; i < files.length; i++) {
          mdLinks.isFile(resolvedPath).then((response) => {
            resolve(response);
          }).catch((err) => {
            console.error(err);    
          });
        }
      }
    }
    if (mdLinks.isFileOrDirectory(myPath) === 'directory') {
      mdLinks.isDirectory(myPath).then((response) => {
        resolve(response);
      }).catch((err) => {
        console.error(err);    
      });
    } else if (mdLinks.isFileOrDirectory(myPath) === 'file') {
      for (let i = 0; i < files.length; i++) {
        mdLinks.isFile(myPath).then((response) => {
          resolve(response);
        }).catch((err) => {
          console.error(err);    
        });
      }
    }
  });
};

mdLinks.isFileOrDirectory = (myPath) => {
  try {
    const fsStats = fs.lstatSync(myPath);
    if (fsStats.isFile()) {
      return 'file';
    } else if (fsStats.isDirectory()) {
      return 'directory';
    }
  } catch (err) {
    console.error(err, 'No es un archivo o directorio');
  }
};

mdLinks.isDirectory = (myPath) => {
  fs.readdir(myPath, 'utf8', function(err, files) {
    if (err) throw err;
    console.log(files);
    files.forEach(element => {
      mdLinks.isFile(element);
    });
  });
};

mdLinks.isFile = (myPath) => {
  if (path.extname(myPath) === '.md') {
    fs.readFile(myPath, 'utf8', (err, data) => {
      if (err) throw err;
      mdLinks.markdownLinkExtractor(data);
    }); 
  }
};

mdLinks.validateLinks = (links) => {

};

// Función necesaria para extraer los links usando marked
// (tomada desde biblioteca del mismo nombre y modificada para el ejercicio)
// Recibe texto en markdown y retorna sus links en un arreglo
mdLinks.markdownLinkExtractor = (markdown) => {
  const links = [];
  const renderer = new Marked.Renderer();

  // Taken from https://github.com/markedjs/marked/issues/1279
  const linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;

  Marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;

  renderer.link = function(href, title, text) {
    links.push({
      href: href,
      text: text,
      title: title,
    });
  };
  renderer.image = function(href, title, text) {
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push({
      href: href,
      text: text,
      title: title,
    });
  };
  Marked(markdown, {renderer: renderer});
  console.log(links);
  return links;
};

module.exports = mdLinks;