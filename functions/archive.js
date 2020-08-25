const fileSystem = require('fs')
const path = require('path')
const archiver = require('archiver')

function archiveFolder (folder, destinationFolder, archiveName) {
  return new Promise((resolve, reject) => {
    // we set the name
    let randomNumber = path.basename(destinationFolder)
    if (isNaN(parseInt(randomNumber))) {
      randomNumber = String(new Date().getTime())
    }
    const url = path.resolve(destinationFolder, archiveName + ' ' + randomNumber + '.zip')

    var output = fileSystem.createWriteStream(url)
    var archive = archiver('zip')

    output.on('close', async () => {
      console.log(archive.pointer() + ' total bytes')
      console.log('archiver has been finalized and the output file descriptor has closed.')

      fileSystem.unlinkSync(folder)
      resolve(url)
    })

    archive.on('error', (err) => {
      reject(err)
      fileSystem.unlinkSync(folder)
    })

    // linking archive with fs file output
    archive.pipe(output)

    archive.directory(folder, false)

    // finalize archi
    archive.finalize()
  })
}

module.exports = { archiveFolder: archiveFolder }
