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
    let resolvedPath = mdLinks.validatePath(myPath);
    let validateTypeOfPath = mdLinks.isFileOrFolder(resolvedPath);
    if (validateTypeOfPath === 'folder') {
      mdLinks.isFolder(resolvedPath);
    } else if (validateTypeOfPath === 'file') {
      mdLinks.isFile(resolvedPath);
    }
  });
};

mdLinks.validatePath = (myPath) => {
  try {
    const isAbsolute = mdLinks.isAbsolute(myPath);
    if (isAbsolute === false) {
      return mdLinks.convertToAbsolutePath(myPath); 
    } else if (isAbsolute === true) {
      return myPath;
    }
  } catch (error) {
    console.error(error, 'No se puede verificar el archivo');
  }
};

mdLinks.isAbsolute = (myPath) => {
  const checkPath = path.resolve(myPath) === path.normalize(myPath).replace(/[\/|\\]$/, '');
  if (checkPath === false) {
    return false;
  } else {
    return true;
  }
};

mdLinks.convertToAbsolutePath = (myPath) => {
  return path.resolve(myPath);
};

mdLinks.isFileOrFolder = (myPath) => {
  try {
    const fsStats = fs.lstatSync(myPath);
    if (fsStats.isFile()) {
      return 'file';
    } else if (fsStats.isDirectory()) {
      return 'folder';
    }
  } catch (err) {
    console.error(err, 'No es un archivo o carpeta');
  }
};

mdLinks.isFolder = (myPath) => {
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
  return links;
};

module.exports = mdLinks;

