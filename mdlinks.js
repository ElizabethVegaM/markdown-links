const fs = require('fs');
const path = require('path');
const Marked = require('marked');
let mdLinks = {};
let validate = false;

// 
// path.resolve(_yourPath) === path.normalize(_yourPath).replace(/[\/|\\]$/, '')

mdLinks.mdLinks = (myPath, options) => {
  return new Promise((resolve, reject) => {
    if (options.validate) validate = true;
    if (!myPath) console.log('Debe ingresar un archivo directorio');
    let isAbsolute = path.resolve(myPath) === path.normalize(myPath).replace(/[\/|\\]$/, '');
    console.log(isAbsolute);
    if (isAbsolute === false) {
      let resolvedPath = path.resolve(myPath);
      console.log(resolvedPath); 
      if (mdLinks.isFileOrDirectory(resolvedPath) === 'directory') {
        mdLinks.isDirectory(resolvedPath);
      } else if (mdLinks.isFileOrDirectory(resolvedPath) === 'file') {
        mdLinks.isFile(resolvedPath);
      }
    }
    console.log(myPath);
    if (mdLinks.isFileOrDirectory(myPath) === 'directory') {
      mdLinks.isDirectory(myPath);
    } else if (mdLinks.isFileOrDirectory(myPath) === 'file') {
      mdLinks.isFile(myPath);
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
  });
};

mdLinks.isFile = (myPath) => {
  if (path.extname(myPath) === '.md') {
    console.log(myPath);  
  }
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