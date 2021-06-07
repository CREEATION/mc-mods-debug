/**
 * ```
 * "C:/Minecraft/mods/example.mod.jar.disabled" = [
 *    0: "/Minecraft/mods"
 *    1: "C:"
 *    2: "example.mod.jar.disabled"
 *    3: "example.mod.jar"
 *    4: ".disabled"
 * ]
 * ```
 * @readonly
 * @enum {number}
 */
export enum FilePathParts {
  /**
   * `/Minecraft/Instance/mods`
   ****
   * _C:/Minecraft/mods/example.mod.jar.disabled_
   */
  Directory,
  /**
   * `C:`
   ****
   * _C:/Minecraft/mods/example.mod.jar.disabled_
   */
  RootDirectory,
  /**
   * `example.mod.jar.disabled`
   ****
   * _C:/Minecraft/mods/example.mod.jar.disabled_
   */
  BaseName,
  /**
   * `example.mod.jar`
   ****
   * _C:/Minecraft/mods/example.mod.jar.disabled_
   */
  Name,
  /**
   * `.disabled`
   ****
   * _C:/Minecraft/mods/example.mod.jar.disabled_
   */
  Extension,
}
