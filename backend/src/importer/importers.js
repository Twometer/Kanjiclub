const dataUriToBuffer = require('data-uri-to-buffer');

const importers = {
    'vocab': require('./vocabImporter.js'),
    'vhf': require('./vhfImporter.js'),
    'txt': require('./txtImporter.js')
}

module.exports.import = async function(ext, lessonName, dataUri) {
    let importer = importers[ext];

    if (importer == null)
        return null;

    let data = dataUriToBuffer(dataUri);
    return await importer(lessonName, data)
}