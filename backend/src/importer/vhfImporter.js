const crypto = require('crypto');

const key = Buffer.from('0108030403020701', 'hex');
const iv = Buffer.from('0301030405030408', 'hex');

module.exports = async function (name, data) {
    try {
        let ciphertext = Buffer.from(data.toString(), 'base64');

        let cipher = crypto.createDecipheriv('des', key, iv);
        let decrypted = cipher.update(ciphertext);
        decrypted = Buffer.concat([decrypted, cipher.final()]);
        decrypted = decrypted.toString();

        let rows = decrypted.split('\n')
            .splice(3)
            .map(l => l.trim())
            .filter(l => l.length);

        let words = [];

        for (let row of rows) {
            let cols = row.split('#')
                .map(r => r.trim())
                .filter(r => r.length);

            words.push({
                foreign: cols[1],
                synonym: cols[2],
                native: cols[0]
            })
        }

        return words;
    } catch {
        return null;
    }
}