import type { FileExtension, FileInfo, FilePath } from "MCMD"
import { FilePathParts } from "../../@types/mcmd/enums"

import {
  readDir as tauriReadDir,
  renameFile as tauriRenameFile,
} from "@tauri-apps/api/fs"

import pathNormalize from "normalize-path"
import slug from "slug"

/**
 * File extensions to recognize as compatible
 */
export const knownFileExtensions: FileExtension[] = [
  {
    name: "jar",
    description: "Executable Jar File",
  },
  {
    name: "disabled",
    description: "Disabled File",
  },
]

// function fsReadDir(path: string): Promise<T> {}

// function fsRenameFile(srcPath: string, destPath: string): Promise<T> {}

// function fsParseFilePath(path: string): FileInfo {}

/**
 * Returns an object containing all parts of the given file path.
 ****
 * @param path File path string to parse.
 * @description _Modified version of the `path-parse` npm package._
 * @author Javier Blanco (http://jbgutierrez.info/)
 * @license MIT (https://github.com/jbgutierrez/path-parse#license)
 */
function fsParsePath(path: string): FilePath {
  if (typeof path !== "string") {
    throw new TypeError(
      `Parameter "path" must be of type string, not ${typeof path}.`,
    )
  }

  // NOTE:  get current operating system in tauri as soon as
  //        this isn't a windows only tool anymore... unless?
  // const splitPathPosixRegExp = /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/
  const splitPathWin32RegExp =
    /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/

  // parse the path, resulting in an array of path parts
  const parts = splitPathWin32RegExp
    .exec(path)
    .slice(1)
    .filter((part) => part)

  if (!parts || parts.length !== 5) {
    throw new TypeError(`Invalid path "${path}"`)
  }

  // get all known file extensions
  let extensions: FileExtension[]

  knownFileExtensions.forEach((extension) => {
    // ["example.file.jar.disabled"].split(".").includes("jar")
    if (parts[FilePathParts.BaseName].split(".").includes(extension.name)) {
      if (!Array.isArray(extensions)) {
        extensions = []
      }

      extensions.push(extension)
    }
  })

  // input: "C:/example.file"
  // > "C:/".slice(0, -1)
  // = "C:"
  let parsedDir = parts[FilePathParts.Directory].slice(0, -1)

  // input: "C:/example.file"
  // v "C:/" === "C:/"
  if (parts[FilePathParts.RootDirectory] === parts[FilePathParts.Directory]) {
    parsedDir = parts[FilePathParts.Directory]
  }

  return {
    id: slug(pathNormalize(path)),
    root: pathNormalize(parts[FilePathParts.RootDirectory]),
    dir: pathNormalize(parsedDir),
    base: parts[FilePathParts.BaseName],
    name: parts[FilePathParts.Name],
    ext: extensions || [{ name: parts[FilePathParts.Extension].slice(1) }],
    normalized: pathNormalize(path),
  }
}

/**
 * Returns `true` if given file object has the given file extension.
 *
 * File extensions don't include the leading dot (e.g. not `.ext`, but `ext`).
 ****
 * @param path File path object to check.
 */
function fsFileHasExtension(filePathObj: FilePath, fileExt: string): boolean {
  return filePathObj.ext.includes(
    knownFileExtensions.find((ext) => ext.name === fileExt),
  )
}

export {
  fsParsePath as parsePath,
  fsFileHasExtension as fileHasExtension,
  // fsReadDir as readDir,
  // fsRenameFile as renameFile,
  // fsParseFilePath as parseFilePath,
}

// function parseFilepath(filepath: string) {
//   function getFilename(str: string) {
//     function split(str: string, by: string) {
//       return str.slice(str.lastIndexOf(by)).split(by)[1]
//     }

//     const separators = ['/', '\\']

//     for (let i = 0; i < separators.length; i++) {
//       if (str.includes(separators[i])) {
//         return split(str, separators[i])
//       }
//     }

//     return str
//   }

//   const filepathParsed = pathParse(filepath),
//     extensions = getFileExtensions(filepathParsed.base)

//   return {
//     id: slug(filepathParsed.base),
//     basename: filepathParsed.base,
//     name: filepathParsed.name.replace(/^(.+)\.jar(?:.disabled)?$/i, '$1'),
//     path: filepathParsed.normalized,
//     extensions,
//     enabled: !extensions.includes('.disabled'),
//   }
// }

// async function list(dir: string) {
//   const dirParsed = pathParse(dir)

//   if (
//     dirParsed.base !== 'mods' &&
//     dirParsed.name !== 'mods' &&
//     !dirParsed.dir.includes('mods')
//   ) {
//     return Promise.reject(
//       `path doesn't include "mods" directory:\n  "${dirParsed.normalized}"`
//     )
//   }

//   let files = await readDir(dirParsed.normalized)

//   return files
//     .map((file) => parseFilepath(pathParse(file.path).normalized))
//     .filter((mod) => mod.extensions.includes('.jar'))
//     .sort()
// }

// async function toggle(filepath: string) {
//   let newFileObj: {
//     id: string
//     basename: string
//     name: string
//     path: string
//     extensions: Array<string>
//     enabled: boolean
//   }

//   await renameFile(filepath, rename(filepath).path)
//     .catch((err) => {
//       throw err
//     })
//     .then(() => {
//       newFileObj = rename(filepath)
//     })

//   return newFileObj
// }

// function rename(filepath: string) {
//   let newFilepath: string
//   let filepathArray = filepath.split('.')

//   if (filepathArray.pop() !== 'disabled') {
//     // filepath[.jar] -> filepath[.jar.disabled]
//     newFilepath = `${filepath}.disabled`
//   } else {
//     // filepath.jar.disabled -> filepath.jar
//     newFilepath = filepathArray.join('.')
//   }

//   return parseFilepath(newFilepath)
// }

// function getFileBasename(filename: string, extensions: Array<string>) {
//   return filename
//     .split('.')
//     .filter((part) => !extensions.includes(`.${part}`))
//     .join('.')
// }

// function getFileExtensions(filename: string) {
//   const extensions = []
//   const parts = filename.split('.')
//   const partsLastIndex = parts.length - 1

//   const isDisabled = parts.lastIndexOf('disabled') === partsLastIndex
//   const isJarFile =
//     parts.lastIndexOf('jar') === partsLastIndex - (isDisabled ? 1 : 0)

//   if (isJarFile) extensions.push('.jar')
//   if (isDisabled) extensions.push('.disabled')

//   return extensions
// }

// export { list, toggle, rename }
