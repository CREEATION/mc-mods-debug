// took this from here for now because "process" isn't available in tauri :(
// @see https://github.com/jbgutierrez/path-parse
'use strict'

// var isWindows = process.platform === 'win32';

// Regex to split a windows path into into [dir, root, basename, name, ext]
var splitWindowsRe =
  /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/

function win32SplitPath(filename) {
  return splitWindowsRe.exec(filename).slice(1)
}

function win32Parse(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
      "Parameter 'pathString' must be a string, not " + typeof pathString
    )
  }
  var allParts = win32SplitPath(pathString)
  if (!allParts || allParts.length !== 5) {
    throw new TypeError("Invalid path '" + pathString + "'")
  }
  return {
    normalized: `${allParts[0]}${allParts[2]}`,
    root: allParts[1],
    dir: allParts[0] === allParts[1] ? allParts[0] : allParts[0].slice(0, -1),
    base: allParts[2],
    ext: allParts[4],
    name: allParts[3],
  }
}

// Split a filename into [dir, root, basename, name, ext], unix version
// 'root' is just a slash, or nothing.
// var splitPathRe = /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/

// function posixSplitPath(filename) {
//   return splitPathRe.exec(filename).slice(1)
// }

// function posixParse(pathString) {
//   if (typeof pathString !== 'string') {
//     throw new TypeError(
//       "Parameter 'pathString' must be a string, not " + typeof pathString
//     )
//   }
//   var allParts = posixSplitPath(pathString)
//   if (!allParts || allParts.length !== 5) {
//     throw new TypeError("Invalid path '" + pathString + "'")
//   }

//   return {
//     normalized: `${allParts[0]}${allParts[2]}`,
//     root: allParts[1],
//     dir: allParts[0].slice(0, -1),
//     base: allParts[2],
//     ext: allParts[4],
//     name: allParts[3],
//   }
// }

export default win32Parse
