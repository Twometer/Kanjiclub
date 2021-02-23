const PRACTICE_SIZE = 8;
const MS_SECOND = 1000;
const MS_MINUTE = MS_SECOND * 60;
const MS_HOUR = MS_MINUTE * 60;

const WORD_COOLDOWN = MS_MINUTE * 5;

const strength = require('../util/strength.js');
const utils = require('../util/utils.js');
const db = require('../database.js');

const appConfig = require('../../conf/kanjiclub.json')

/* helper methods */
function hasLastPractice(word) {
    return word.stats != null && word.stats.lastPracticed != null;
}

function getLastPracticed(word) {
    return word.stats.lastPracticed.getTime();
}

function getAbsoluteWordAge(word) {
    if (!hasLastPractice(word))
        return Number.MAX_SAFE_INTEGER;

    let lastPractice = getLastPracticed(word);
    return Date.now() - lastPractice;
}

function getRelativeWordAge(word, config) {
    if (!hasLastPractice(word) || !hasLastPractice(config.oldest))
        return 1.0;

    let now = Date.now();
    let maxAge = now - getLastPracticed(config.oldest);
    let age = now - getLastPracticed(word);
    return Math.max(Math.min(age / maxAge, 1.0), 0.0);
}

function isLastWordStanding(word, config) {
    for (let i = config.strength; i < config.groups.length; i++) {
        let filteredGroup = config.groups[i].filter(w => w._id != word._id);
        if (filteredGroup.length != 0)
            return false;
    }
    return true;
}

/* random word picker */
function tryFindWord(config) {
    let index = Math.floor(Math.random() * config.input.length);
    let word = config.input[index];

    let relWordAge = getRelativeWordAge(word, config);
    let absWordAge = getAbsoluteWordAge(word);
    // console.log(word._id, word.data.foreign, word.data.native, relWordAge, absWordAge, isLastWordStanding(word, config), config.strength);

    // If the word is still in cooldown, and we are not at the only
    // available word, then discard the word
    if (absWordAge < WORD_COOLDOWN && !isLastWordStanding(word, config)) {
        return null;
    }

    // If the word is newer than 50% of the set, then there's a 65% chance that
    // the word is discarded
    if (relWordAge < 0.5 && Math.random() < 0.65) {
        return null;
    }

    return { index: index, word: word }
}

function tryFindNewWord(config) {
    let maxRetries = PRACTICE_SIZE * 2;

    for (let i = 0; i < maxRetries; i++) {
        // Try find a new word
        let wordItem = tryFindWord(config);

        // It was not possible
        if (wordItem == null)
            continue;

        // It already exists
        if (config.output.some(w => w.id == wordItem.word._id))
            continue;

        // Yay, we found one
        return wordItem;
    }
    // Nay, we didn't find one
    return null;
}

function selectRandomWords(config) {
    while (config.input.length > 0 && config.output.length < PRACTICE_SIZE) {
        let item = tryFindNewWord(config);
        if (item == null)
            return;

        config.input.splice(item.index, 1);
        config.output.push(item.word);
    }
}

function dateDaysAgo(days) {
    var millis = Date.now();
    millis -= days * 24 * 60 * 60 * 1000;
    return new Date(millis);
}

function runSrsDowngrade() {
    const threshold1 = dateDaysAgo(appConfig.srs.downgradeIntervals[0]);
    const threshold2 = dateDaysAgo(appConfig.srs.downgradeIntervals[1]);

    // Strong words degrade to medium
    db.Word.find({
        "stats.lastPracticed": { $lte: threshold1.toISOString() },
        strength: 2
    }, (err, docs) => {
        if (err) {
            console.err(err);
            return;
        }

        for (var doc of docs) {
            doc.strength = 1;
            doc.save();
        }
    });

    // Medium words degrade to weak
    db.Word.find({
        "stats.lastPracticed": { $lte: threshold2.toISOString() },
        strength: 1
    }, (err, docs) => {
        if (err) {
            console.err(err);
            return;
        }

        for (var doc of docs) {
            doc.strength = 0;
            doc.save();
        }
    });
}


/* api */
module.exports.initialize = function () {
    setInterval(() => runSrsDowngrade(), MS_HOUR);
    runSrsDowngrade();
    console.log("SRS task initialized")
}


module.exports.generatePractice = function (words) {
    // Shuffle candidates
    utils.shuffle(words);

    // Setup word groups
    let wordGroups = [];
    for (let i = 0; i < Object.keys(strength).length; i++) {
        wordGroups.push([]);
    }

    // Preprocess the words
    let oldestWord = words[0];
    for (let word of words) {
        // Find oldest word
        if (hasLastPractice(word)) {
            if (!hasLastPractice(oldestWord) || getLastPracticed(word) < getLastPracticed(oldestWord)) {
                oldestWord = word;
            }
        }

        // Sort into group
        wordGroups[word.strength].push(word);
    }

    // Generate practice unit from word groups
    let practiceUnit = [];
    for (let i = 0; i < wordGroups.length; i++) {
        selectRandomWords({
            input: wordGroups[i],
            output: practiceUnit,
            groups: wordGroups,
            strength: i,
            oldest: oldestWord
        });
    }

    // Shuffle one last time
    utils.shuffle(practiceUnit);
    return practiceUnit;
}


module.exports.gradeWord = function (attempts) {
    switch (attempts) {
        case 0:
            return 1;
        case 1:
            return -1;
        case 2:
        case 3:
            return -2;
        default:
            return 0;
    }
}
