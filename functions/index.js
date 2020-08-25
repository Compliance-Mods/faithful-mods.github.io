/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */

const fs = require('fs')
const path = require('path')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp({
  storageBucket: 'faithful-mods-cefd4.appspot.com'
})

// utilities
const { v4: uuidv4 } = require('uuid')

const { downloadArchive } = require('./download')
const { archiveFolder } = require('./archive')

const TMP_ROOT_FOLDER = `${__dirname}/temp/`
const DOWNLOAD_ROOT_FOLDER = `${__dirname}/download/`
const FINAL_NAME = 'Faithful Mods Resource Pack'

const BUCKET_FOLDER = 'temp'

// Delete all the genrated packs every day (ABOUT MIDNIGHT EST)
exports.deletePacks = functions.pubsub.schedule('0 4 * * *').onRun(async (cxt) => {
  const bucket = admin.storage().bucket() // Storage bucket

  // Delete everything in FaithfulTweaks/
  bucket.deleteFiles({
    prefix: BUCKET_FOLDER + '/'
  }, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('All the zip files from ' + BUCKET_FOLDER + '/ have been deleted')
    }
  })
})

exports.downloadArchive = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', process.env.NODE_ENV !== 'production' ? '*' : 'https://faithfultweaks.com')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.set('Content-Type', 'application/json')

  const bucket = admin.storage().bucket() // Storage bucket

  downloadArchive(TMP_ROOT_FOLDER, ['Faithful-Mods/actuallyadditions#1.12.2', 'Faithful-Mods/abyssalcraft#1.12.2']) // JSON.parse(req.body.packs)
    .then(function (destination) {
      // post download script
      archiveFolder(destination, DOWNLOAD_ROOT_FOLDER, FINAL_NAME).then(function (filepath) {
        console.log(filepath)

        // ----- UPLOAD THE ARCHIVE -----
        const fileUUID = uuidv4()
        const tokenUUID = uuidv4()
        const newPackPath = path.join(BUCKET_FOLDER, FINAL_NAME + fileUUID + '.zip') // New file upload path

        const metadata = {
          contentType: 'application/zip',
          metadata: {
            firebaseStorageDownloadTokens: tokenUUID
          }
        }

        bucket.upload(filepath, {
          destination: newPackPath,
          metadata: metadata
        }).then((data) => {
          const file = data[0]
          // Respond with URL
          res.status(200).send({ 'url': 'https://firebasestorage.googleapis.com/v0/b/' + bucket.name + '/o/' + encodeURIComponent(file.name) + '?alt=media&token=' + tokenUUID })
          fs.unlinkSync(filepath) // Unlink file
        }).catch(function (err) {
          console.error(err)
        })
      })
        .catch(function (err) {
          console.error(err)
        })
    })
    .catch(function (err) {
      console.error(err)
    })
})
