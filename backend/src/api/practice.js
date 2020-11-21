const practiceSize = 8;
const strength = require('../util/strength.js')
const utils = require('../util/utils.js')

module.exports = (app, db) => {

    function getWordAge(word) {
        // TODO: Currently, we assume 10 days as max age
        //       and clamp everything above that. However,
        //       we should get the actual max age from
        //       the oldest word in the set.
        const maxAgeMs = 10 * 24 * 60 * 60 * 1000;

        let lastPracticed = word.stats.lastPracticed;
        if (lastPracticed == null) return 1.0;

        let timeDiff = Date.now().getTime() - lastPracticed.getTime();
        return Math.min(timeDiff / maxAgeMs, 1.0)
    }

    function pickRandomWord(words) {
        let idx = Math.floor(Math.random() * words.length);
        let word = words[idx];

        let wordAge = getWordAge(word);
        
        // If the word is older than 50% of the 
        // current word set, then there's a 10%
        // chance a different word is selected
        // instead
        if (wordAge < 0.5 && Math.random() <= 0.1) {
            return pickRandomWord(words);
        }

        return { idx: idx, word: word }
    }

    function pickUniqueRandomWord(inWords, unique) {
        let tries = 0;

        let randomWordItem = null;
        do {
            randomWordItem = pickRandomWord(inWords);

            tries++;
            if (tries > 50)
                break;
        } while (unique.some(w => w._id == randomWordItem.word._id));

        return randomWordItem;
    }

    function populateRandomly(inWords, outWords) {
        while (inWords.length > 0 && outWords.length < practiceSize) {
            let randomWordItem = pickUniqueRandomWord(inWords, outWords);
            if (randomWordItem == null)
                return;

            inWords.splice(randomWordItem.idx, 1);
            outWords.push(randomWordItem.word);
        }
    }

    app.post("/api/practice/:languageCode/new", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

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

        // Query candidate words
        db.Word.find({
            account: req.session.accountId,
            language: req.params.languageCode,
            lesson: { $in: req.body.lessons }
        }, (err, docs) => {
            // Can't have an empty practice
            if (docs.length == 0)
                return res.status(404).send();

            // Group by strength:
            let maxStrength = Object.keys(strength).length;

            let candidateWords = [];
            for (let i = 0; i < maxStrength; i++)
                candidateWords.push([]);

            for (let w of docs)
                candidateWords[w.strength].push(w);

            // Select randomly
            let words = [];
            for (let i = 0; i < maxStrength; i++)
                populateRandomly(candidateWords[i], words);

            // Shuffle resulting array
            utils.shuffle(words);

            return res.json(words.map(w => {
                return {
                    id: w._id,
                    data: w.data
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
                if (err) return;

                word.stats.lastPracticed = Date.now()
                word.strength += strengthOffset;
                if (word.strength < 0) word.strength = 0;
                if (word.strength > 2) word.strength = 2;
                word.save();
            });
        }

        return res.status(200);
    })

    /**
     * Notes on implementing the frontend
     * ==================================
     * - The frontend is responsible for randomizing translation direction
     *   and reporting back how often the user failed a particular word.
     * - The frontend may ask a word a few times:
     *   1. If the user inputs a translation wrongly, the word will be
     *      asked again at the end of a lesson, for a max of 3 times.
     *   2. If the user wants to be asked synoyms, a random synonym
     *      may be used as the foreign prompt. Foreign input always
     *      accepts all synonyms as well.
     *   3. If the user wants to have randomized translation direction,
     *      a word may appear multiple times, in different directions.
     *       If this setting is active, a lower number of total words per
     *      practice may be used. TODO: check if this is neccessary
     *   4. Maybe we should let the user decide on how large they want
     *      each indiviudal lesson to be.
     */

}