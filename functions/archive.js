const file_system = require('fs');
const path = require('path');
const archiver = require('archiver');

function archiveFolder(folder, destinationFolder, archiveName) {
  return new Promise((resolve, reject) => {
    // we set the name
    let randomNumber = path.basename(destinationFolder);
    if(isNaN(parseInt(randomNumber))) {
      randomNumber = '' + new Date().getTime();
    }
    const url = path.resolve(destinationFolder, archiveName + ' ' + randomNumber + '.zip');

    var output = file_system.createWriteStream(url);
    var archive = archiver('zip');

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');

        resolve(url);
        fs.unlinkSync(folder);
    });

    archive.on('error', function(err){
        reject(err);
        fs.unlinkSync(folder);
    });

    // linking archive with fs file output
    archive.pipe(output);
    
    archive.directory(folder, false);

    // finalize archi
    archive.finalize();
  })
}

module.exports = { archiveFolder: archiveFolder };