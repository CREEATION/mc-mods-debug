import { fileHasExtension, parsePath } from "../../../../lib/filesystem"

const testPaths = require("../../../helpers/testPaths.json")

describe("parsePath", () => {
  it(`parses a path string returning a path parts object`, () => {
    testPaths.forEach((path) => {
      if (path.parsePath) {
        expect(parsePath(path.test)).toEqual(path.parsePath.toEqual)
      }
    })
  })

  it(`fails to parse anything other than strings`, () => {
    expect(function () {
      // @ts-ignore
      parsePath({ foo: "bar" })
    }).toThrow()
  })

  it(`fails to parse empty strings`, () => {
    expect(function () {
      parsePath("")
    }).toThrow()
  })
})

describe("fileHasExtension", () => {
  it(`checks if the given file path object includes a specific file extension`, () => {
    testPaths.forEach((path) => {
      if (path.fileHasExtension) {
        expect(
          fileHasExtension(parsePath(path.test), path.fileHasExtension.expect),
        ).toBe(path.fileHasExtension.toBe)
      }
    })
  })
})
