const practiceSize = 8;
const strength = require('../util/strength.js')
const utils = require('../util/utils.js')

const MS_SECOND = 1000;
const MS_MINUTE = 60 * MS_SECOND;

module.exports = (app, db) => {

    /**
     * Algorithm for creating new practices
     * ====================================
     * 
     * Query words from database, ordered by last practice
     * and word strength.
     * 
     * Fill the practiceSize amount of words with
     *  - all weak words
     *  - if there is still space, all medium words
     *  - if there is still space, all strong words.
     *  - Shuffle
     * 
     * Selecting a new word should be random, but also
     * take into account the last practice date. Words that
     * were recently practiced are 'less weak' than those that
     * have been sitting on the weak list forever. However,
     * we also don't want to bombard the user with the same 5 words
     * they just can't get into their head.
     * This could be implemented by making older words have a higher 
     * probability of getting picked in the randomizer.
     * 
     * The same word with the same translation direction
     * should never be selected twice into a practice.
     * 
     * If the user selects a certain word strength
     * ===========================================
     * Create a new practice, consisting of
     * n = min(num_words, practiceSize) words, randomly picked from
     * the group of words with the selected word strength
     */

    function getAbsoluteWordAge(word) {
        if (word.stats.lastPracticed == null)
            return Number.MAX_SAFE_INTEGER;
        
        let now = Date.now();
        return now - word.stats.lastPracticed.getTime();
    }

    function getRelativeWordAge(word, oldestWord) {
        if (word.stats.lastPracticed == null || oldestWord.stats.lastPracticed == null)
            return 1.0;

        let now = Date.now();
        let maxAge = now - oldestWord.stats.lastPracticed.getTime();
        let age = now - word.stats.lastPracticed.getTime();

        return Math.min(age / maxAge, 1.0)
    }

    function pickRandomWord(words, oldestWord) {
        let idx = Math.floor(Math.random() * words.length);
        let word = words[idx];

        let absoluteWordAge = getAbsoluteWordAge(word);
        let relativeWordAge = getRelativeWordAge(word, oldestWord);

        // If the word is newer than 50% of the 
        // current word set, then there's a 50%
        // chance another word will be selected
        // instead
        if (relativeWordAge > 0.5 && Math.random() > 0.5) {
            return pickRandomWord(words, oldestWord);
        }

        // If the word is newer than 2 minutes,
        // there's a 90% chance a different word
        // will be selected
        if (absoluteWordAge < 2 * MS_MINUTE && Math.random() < 0.9) {
            return pickRandomWord(words, oldestWord);
        }

        return { idx: idx, word: word }
    }

    function pickUniqueRandomWord(inWords, exclude, oldestWord) {
        let tries = 0;

        let randomWordItem = null;
        do {
            randomWordItem = pickRandomWord(inWords, oldestWord);

            if (tries++ > 50)
                break;
        } while (exclude.some(w => w._id == randomWordItem.word._id));

        return randomWordItem;
    }

    function populateRandomly(inWords, outWords, oldestWord) {
        while (inWords.length > 0 && outWords.length < practiceSize) {
            let randomWordItem = pickUniqueRandomWord(inWords, outWords, oldestWord);
            if (randomWordItem == null)
                return;

            inWords.splice(randomWordItem.idx, 1);
            outWords.push(randomWordItem.word);
        }
    }

    function generatePractice(words) {
        // Group by strength:
        let maxStrength = Object.keys(strength).length;

        let candidateWords = [];
        for (let i = 0; i < maxStrength; i++)
            candidateWords.push([]);

        let oldestWord = words[0];
        for (let word of words) {
            if (word.stats.lastPracticed) {
                let lastPracticed = word.stats.lastPracticed.getTime();
                if (oldestWord.stats.lastPracticed == null || lastPracticed < oldestWord.stats.lastPracticed.getTime()) {
                    oldestWord = word;
                }
            }

            candidateWords[word.strength].push(word);
        }

        // Select randomly
        let selectedWords = [];
        for (let i = 0; i < maxStrength; i++)
            populateRandomly(candidateWords[i], selectedWords, oldestWord);

        // Shuffle resulting array
        utils.shuffle(selectedWords);
        return selectedWords;
    }

    app.post("/api/practice/:languageCode/new", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }


        // Build word query
        let query = {
            account: req.session.accountId,
            language: req.params.languageCode
        };

        let body = req.body;

        switch (body.target) {
            case "lesson":
                if (!body.lessons)
                    return res.status(400).send();

                query.lesson = { $in: body.lessons };
                break;
            case "strength":
                if (!body.strength)
                    return res.status(400).send();

                query.strength = strength[body.strength];
                break;
            default:
                return res.status(400).send();
        }

        // Load candidate words
        db.Word.find(query, (err, docs) => {
            if (err)
                return res.status(500).send();

            // Can't have an empty practice
            if (docs.length == 0)
                return res.status(404).send();

            // Generate practice
            let words = generatePractice(docs);

            return res.json(words.map(w => {
                return {
                    id: w._id,
                    data: w.data,
                    lesson: w.lesson
                }
            }));
        });

    })

    function getStrengthOffset(attempts) {
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

    app.post("/api/practice/:languageCode/complete", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        /**
         * Algorithm for grading a lesson
         * ==============================
         * 
         * For each word the user practiced, that was not
         * wrong / "Didn't know" more than once, move it
         * up one category: weak -> medium, medium -> strong
         * 
         * For each word the user input wrongly, put it into
         * a lower category:
         *  Wrong once: Degrade by one
         *  Wrong twice: Degrade by two
         */

        let results = req.body.results;
        for (let result of results) {
            const strengthOffset = getStrengthOffset(result.attempts);

            db.Word.findOne({ _id: result.wordId }, (err, word) => {
                if (err) {
                    console.error(err);
                    return;
                }

                word.stats.lastPracticed = new Date()
                word.strength += strengthOffset;
                if (word.strength < 0) word.strength = 0;
                if (word.strength > 2) word.strength = 2;
                word.save();
            });
        }

        return res.status(200).send();
    })

}