const crypto = require('crypto')

module.exports = (key, salt, cb) => {
    crypto.pbkdf2(key, salt, 100000, 48, 'sha512', (err, derivedKey) => {
        if (err) throw err;
        cb(derivedKey.toString('base64'));
    })
}