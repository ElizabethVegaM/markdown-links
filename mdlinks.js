const fs = require('fs');
const path = require('path');
const Marked = require('marked');
const fetch = require('node-fetch');
let mdLinks = {};
let validate = false;
let stats = false;

mdLinks.mdLinks = (myPath, options) => {
  return new Promise((resolve, reject) => {
    if (options.validate) validate = true;
    if (options.stats) stats = true;
    if (!myPath) console.log('Debe ingresar un archivo directorio');
    let resolvedPath = mdLinks.validatePath(myPath);
    let validateTypeOfPath = mdLinks.isFileOrFolder(resolvedPath);
    if (validateTypeOfPath === 'folder') {
      mdLinks.isFolder(resolvedPath).then((data) => {
        resolve(data);
      });
    } else if (validateTypeOfPath === 'file') {
      mdLinks.isFile(resolvedPath).then((data) => {
        resolve(data);
      });   
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
  return new Promise((resolve, reject) => {
    fs.readdir(myPath, 'utf8', function(err, files) {
      const filePromises = files.map((aFile) => {
        let filePath = myPath + '/' + aFile;
        return mdLinks.isFile(filePath);
      });
      Promise.all(filePromises).then((filesData) => {
        filesData = filesData.reduce((value1, value2) => value1.concat(value2));
        resolve(filesData);
      }).catch((error) => {
        console.error('Error > ' + error);
      });
    });
  });
};

mdLinks.isFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileExt = mdLinks.checkExtName(file);
    if (fileExt === '.md') {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) reject(err);
        data = data.split('\n').map(element => mdLinks.markdownLinkExtractor(file, element, data.indexOf(element) + 1)).filter(element => element.length !== 0).reduce((value1, value2) => value1.concat(value2));
        resolve(data);
      }); 
    }
  });
};

mdLinks.checkExtName = (file) => {
  return path.extname(file);
};

mdLinks.validateLink = (links) => {
  return new Promise((resolve, reject) => {
    fetch(links)
      .then(res => res.status)
      .then(body => console.log(body))
      .catch((err) => {
        reject(err);
      });
  });
};


// Función necesaria para extraer los links usando marked
// (tomada desde biblioteca del mismo nombre y modificada para el ejercicio)
// Recibe texto en markdown y retorna sus links en un arreglo
mdLinks.markdownLinkExtractor = (file, markdown, line) => {
  const links = [];
  const renderer = new Marked.Renderer();
  // Taken from https://github.com/markedjs/marked/issues/1279
  const linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;

  Marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;

  renderer.link = function(href, title, text) {
    // let linkStatus = mdLinks.validateLink(href);
    // console.log(linkStatus);
    links.push({
      href: href,
      text: text,
      file: file,
      line: line,
      // status: linkStatus,
    });
  };
  renderer.image = function(href, title, text) {
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push({
      href: href,
      text: text,
      file: file,
      line: line
    });
    if (validate === true) {
      mdLinks.validateLink(href);
    }
  };
  Marked(markdown, {renderer: renderer});
  return links;
};

module.exports = mdLinks;