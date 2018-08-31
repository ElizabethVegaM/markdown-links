# Markdown Links Extractor

Pequeña librería que analiza archivos de tipo [Markdown](https://es.wikipedia.org/wiki/Markdown)(.md) para verificar los links que contengan y entregar algunas estadísticas.

## Comenzando 🚀

En la pestaña 'releases' encontrarás el archivo .zip correspondiente al proyecto, el que deberás descargar para su posterior utilización.

### Pre-requisitos 📋

Para el correcto funcionamiento de este proyecto necesitas tener instalado [Node.js](https://nodejs.org/) en tu computador. Para las pruebas unitarias se utilizó [Jest](https://jestjs.io/) por su simpleza.

#### Paquetes necesarios 

- [Path](https://nodejs.org/api/path.html)
- [File System](https://nodejs.org/api/fs.html)
- [Colors](https://www.npmjs.com/package/colors)

### Instalación 🔧

Para utilizar esta librería primero debes descomprimir el archivo .zip que se encuentra disponible en la pestaña 'releases' de este repositorio.

Debes instalar el módulo con npm

```
npm install md-links
```

Instalar Jest en caso de que lo utilices

```
npm install --save-dev jest
```
Instalar los paquetes necesarios

```
npm install --save path
var fs = require('fs')
npm install colors
```

## Versiones de la librería 📄

### Versión 1.0.0
Versión inicial con todas las características básicas. Se incluye la opción de validar links (--validate) y ver estadísticas básicas (--stats)
### Versión 1.0.1
- Se añade el paquete [Colors](https://www.npmjs.com/package/colors) para visualizar mejor los datos en la terminal.
- Se mejora la manera en la que se imprimen los datos.

## Snippets de uso 🎁

Este proyecto puede ser utilizado a través de la terminal CLI

Por ejemplo:

`md-links <path-to-file> [options]`
Donde options puede ser 'validate' para verificar el estado del link y/o 'stats' para ver estádisticas del archivo(path) como cantidad de links encontrados, links rotos, etc 

```
$ md-links README.md
 [
   {'./some/example.md: 10 - http://algo.com/2/3/ Link a algo'}
   {'./some/example.md: 15 - https://otra-cosa.net/algun-doc.html algún doc'}
   {'./some/example.md: 14 - http://google.com/ Google'}
 ]
```
Usando validate:

```
$ md-links README.md --validate
 [
   {'./some/example.md: 10 - http://algo.com/2/3/ Link a algo 200 true'}
   {'./some/example.md: 15 - https://otra-cosa.net/algun-doc.html 404 false'}
   {'./some/example.md: 14 - http://google.com/ 200 true'}
 ]
```

Usando validate y --stats (pueden usarse tanto juntos como separados)
```
$ md-links README.md --validate
 [
   {'./some/example.md: 10 - http://algo.com/2/3/ Link a algo 200 true'}
   {'./some/example.md: 15 - https://otra-cosa.net/algun-doc.html 404 false'}
   {'./some/example.md: 14 - http://google.com/ 200 true'}
   { totals: 3, success: 2, failure: 1 }
 ]
```

## Autores ✒️

* **Elizabeth Vega** - [ElizabethVegaM](https://github.com/ElizabethVegaM)