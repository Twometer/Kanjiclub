const allowedKeys = ['', 'foreign', 'synonym', 'gender', 'native', 'comment'];

module.exports = async function (name, data) {
    let lines = data.toString()
        .split(/\r?\n/)
        .map(s => s.trim());

    let template = [];
    let words = [];
    let currentWord = {};

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line.startsWith('`')) {
            let key = line.substr(1).trim();

            if (allowedKeys.includes(key))
                template.push(key);
            else {
                //console.log("invalid key", key)
                return null; // Invalid keys not allowed
            }
        }
        else {
            // No template specified
            if (template.length == 0) {
                //console.log("Missing template");
                return null;
            }

            let keyIdx = i % template.length;
            let key = template[keyIdx];
            if (key.length == 0) continue;

            currentWord[key] = line;

            if (keyIdx == template.length - 1) {
                //console.log("Word end!");
                if (currentWord != null) words.push(currentWord);
                currentWord = {};
            }
        }

    }
    return words;
}