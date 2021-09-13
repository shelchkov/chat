// @ts-ignore
import fs from "fs"
// @ts-ignore
import path from "path"

const createFolder = (target: string) => {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target)
  }
}

const copyFile = (source: string, target: string) => {
  let targetFile = target

  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source))
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source))
}

const copyFolder = (source: string, target: string, skipFiles?: string[]) => {
  createFolder(target)

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source)

    files.forEach((file: string) => {
      const curSource = path.join(source, file)

      if (skipFiles && skipFiles.includes(curSource)) {
        return
      }

      if (fs.lstatSync(curSource).isDirectory()) {
        return copyFolder(curSource, path.join(target, file), skipFiles)
      }

      copyFile(curSource, target)
    })
  }
}

copyFolder("client/build", "api/src/static")
