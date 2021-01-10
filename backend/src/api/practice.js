const srs = require('../practice/srs.js');

module.exports = (app, db) => {

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
            let words = srs.generatePractice(docs);

            return res.json(words.map(w => {
                return {
                    id: w._id,
                    data: w.data,
                    lesson: w.lesson
                }
            }));
        });

    })

    app.post("/api/practice/:languageCode/complete", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        let results = req.body.results;
        for (let result of results) {
            const strengthOffset = srs.gradeWord(result.attempts);

            db.Word.findOne({ _id: result.wordId }, (err, word) => {
                if (err) {
                    console.error(err);
                    return;
                }

                word.stats.lastPracticed = new Date();
                word.strength += strengthOffset;
                if (word.strength < 0) word.strength = 0;
                if (word.strength > 2) word.strength = 2;
                word.save();
            });
        }

        return res.status(200).send();
    })

}