import { readDir, renameFile } from '@tauri-apps/api/fs'

import slug from 'slug'

function parseFilepath(filepath: string) {
  function getFilename(str: string) {
    function split(str: string, by: string) {
      return str.slice(str.lastIndexOf(by)).split(by)[1]
    }

    const separators = ['/', '\\']

    for (let i = 0; i < separators.length; i++) {
      if (str.includes(separators[i])) {
        return split(str, separators[i])
      }
    }

    return str
  }

  let name: string = getFilename(filepath)
  let extensions: Array<string> = getFileExtensions(name)
  let basename: string = getFileBasename(name, extensions)

  return {
    id: slug(basename),
    basename,
    name,
    path: filepath,
    extensions,
    enabled: !extensions.includes('.disabled'),
  }
}

async function list(dir: string) {
  while (dir.includes('//')) {
    dir = dir.replace('//', '/')
  }

  while (dir.includes('\\')) {
    dir = dir.replace('\\', '/')
  }

  if (dir.slice(-1) !== '/') {
    dir += '/'
  }

  let files = await readDir(dir)

  return files
    .map((file) => parseFilepath(file.path))
    .filter((mod) => mod.extensions.includes('.jar'))
    .sort()
}

async function toggle(filepath: string) {
  let newFileObj: {
    id: string
    basename: string
    name: string
    path: string
    extensions: Array<string>
    enabled: boolean
  }

  await renameFile(filepath, rename(filepath).path)
    .catch((err) => {
      throw err
    })
    .then(() => {
      newFileObj = rename(filepath)
    })

  return newFileObj
}

function rename(filepath: string) {
  let newFilepath: string
  let filepathArray = filepath.split('.')

  if (filepathArray.pop() !== 'disabled') {
    // filepath[.jar] -> filepath[.jar.disabled]
    newFilepath = `${filepath}.disabled`
  } else {
    // filepath.jar.disabled -> filepath.jar
    newFilepath = filepathArray.join('.')
  }

  return parseFilepath(newFilepath)
}

function getFileBasename(filename: string, extensions: Array<string>) {
  return filename
    .split('.')
    .filter((part) => !extensions.includes(`.${part}`))
    .join('.')
}

function getFileExtensions(filename: string) {
  const extensions = []
  const parts = filename.split('.')
  const partsLastIndex = parts.length - 1

  const isDisabled = parts.lastIndexOf('disabled') === partsLastIndex
  const isJarFile =
    parts.lastIndexOf('jar') === partsLastIndex - (isDisabled ? 1 : 0)

  if (isJarFile) extensions.push('.jar')
  if (isDisabled) extensions.push('.disabled')

  return extensions
}

export { list, toggle, rename }
