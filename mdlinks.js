const fs = require('fs');
const path = require('path');
const Marked = require('marked');
const fetch = require('node-fetch');
let mdLinks = {};
let validate = false;

mdLinks.mdLinks = (myPath, options) => {
  return new Promise((resolve, reject) => {
    if (options.validate) validate = true;
    if (!myPath) console.log('Debe ingresar un archivo directorio');
    let resolvedPath = mdLinks.validatePath(myPath);
    console.log(resolvedPath);
    let validateTypeOfPath = mdLinks.isFileOrFolder(resolvedPath);
    if (validateTypeOfPath === 'folder') {
      mdLinks.isFolder(resolvedPath);
    } else if (validateTypeOfPath === 'file') {
      try {
        mdLinks.isFile(resolvedPath);
      } catch (error) {
        console.error(err);
      }
    }
    resolve();
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
  fs.readdirSync(myPath, 'utf8', function(err, files) {
    if (err) throw err;
    console.log(files);
    files.forEach(element => {
      mdLinks.isFile(element);
    });
  });
};

mdLinks.isFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileExt = mdLinks.checkExtName(file);
    if (fileExt === '.md') {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) return reject(err);
        return mdLinks.markdownLinkExtractor(data);
      });
    }
    /* let promises = [];
      files.forEach(file => {
        promises.push(mdLinks.mdLinks(`${path}/${file}`).then(response => response)
          .catch(err => reject(err)));
      });
      Promise.all(promises).then(values => resolve(values.reduce((elem1, elem2) => elem1.concat(elem2))));
  */
  });
};

mdLinks.checkExtName = (file) => {
  return path.extname(file);
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
      // title: title,
    });
  };
  renderer.image = function(href, title, text) {
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push({
      href: href,
      text: text,
      // title: title,
    });
  };
  Marked(markdown, {renderer: renderer});
  console.log(links);
  return links;
};

module.exports = mdLinks;

