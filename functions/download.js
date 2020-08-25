/* eslint-disable promise/always-return */
/* eslint-disable no-loop-func */
const fs = require('fs')
const os = require('os')
const path = require('path')
const download = require('download-git-repo')

// generate custom named temp folder*
function generateTempFolderName () {
  return 'tmp' + new Date().getTime()
}

function downloadArchive (rootDestinationFolder, gitRepos) {
  return new Promise((resolve, reject) => {
    if (!gitRepos || !Array.isArray(gitRepos) || gitRepos.length === 0) { reject(new Error('Incorrect parameters')) }

    // if we start the program, generate new folder
    let dest = path.resolve(os.tmpdir() + '/', generateTempFolderName())

    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) { reject(err) } else {
        const nbOfRepos = gitRepos.length
        let reposDownloaded = 0
        while (gitRepos.length !== 0) {
          const repo = gitRepos.pop()

          downloadRepo(repo, dest).then(() => {
            ++reposDownloaded

            if (reposDownloaded === nbOfRepos) {
              resolve(dest)
            }
          }).catch((err) => {
            fs.rmdirSync(dest)
            reject(err)
          })
        }
      }
    })
  })
}

function downloadRepo (repo, destination) {
  return new Promise((resolve, reject) => {
    download(repo, destination, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(repo)
      }
    })
  })
}

module.exports = { downloadArchive: downloadArchive }
