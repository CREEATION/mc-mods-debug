export as namespace MCMD

export type FileExtension {
  /** e.g. `jar` or `disabled` without the leading dot (`.`). */
  name: string
  /**
   * Description of the file extension.
   *
   * Either as shown in the file explorer or a custom description. */
  description?: string
}

export type FilePath {
  id: string
  root?: string
  dir?: string
  base: string
  name: string
  ext: FileExtension[]
  normalized?: string
}

export type FileInfo {
  uid: string
  file: FilePath
  enabled: boolean
}
