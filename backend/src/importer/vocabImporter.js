const AdmZip = require('adm-zip')
const xml2js = require('xml2js');

function parseStringAsync(xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    })
}

function readXmlFromVocab(buf) {
    return new Promise((resolve, reject) => {

        let zip = new AdmZip(buf);
        let entries = zip.getEntries();

        for (let entry of entries) {
            if (entry.entryName == 'vocab.xml') {
                zip.readAsTextAsync(entry, data => resolve(data));
                return;
            }
        }

        reject();

    })
}

function findField(fields, label) {
    for (let field of fields) {
        if (field.label[0] === label)
            return field.value[0];
    }
}

function fieldsToWordData(fields) {
    const synonymSeparator = '　';

    let foreign = findField(fields, 'Foreign');
    let synonym = undefined;
    if (foreign.includes(synonymSeparator)) {
        synonym = foreign.substr(foreign.indexOf(synonymSeparator) + 1);
        foreign = foreign.substr(0, foreign.indexOf(synonymSeparator));
    }

    return {
        foreign: foreign,
        synonym: synonym,
        gender: findField(fields, 'Type'),
        native: findField(fields, 'User'),
        comment: findField(fields, 'Comment')
    }
}

module.exports = async function(name, data) {
    try {

        let xml = await readXmlFromVocab(data);
        let entries = (await parseStringAsync(xml)).trainingUnit.entry;
        let words = [];

        for (let entry of entries) {
            words.push(fieldsToWordData(entry.field))
        }

        return words;
    } catch (e) {
        console.error(e);
        return null;
    }
}