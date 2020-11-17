const utils = require('../util/utils.js');
const { v4: uuidv4 } = require('uuid');

module.exports = (app, db) => {

    app.get("/api/words", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const query = req.query;
        if (!query.lang || (query.strength && query.lesson) || (!query.strength && !query.lesson)) {
            return res.status(400).send();
        }

        function dbCallback(err, words) {
            const response = words.map(w => {
                return {
                    id: w._id,
                    lesson: w.lesson,
                    language: w.language,
                    createdOn: w.createdOn,
                    strength: w.strength,
                    data: w.data
                }
            })

            return res.json(response);
        }

        if (query.strength)
            db.Word.find({ account: req.session.accountId, language: query.lang, strength: query.strength }, dbCallback)
        else if (query.lesson)
            db.Word.find({ account: req.session.accountId, language: query.lang, lesson: query.lesson }, dbCallback)
    })

    app.post("/api/words/new", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const body = req.body;
        if (!body.lesson || !body.data)
            return res.status(400).send();

        db.Lesson.findOne({ _id: body.lesson, account: req.session.accountId }, (err, lesson) => {
            if (lesson == null)
                return res.status(404).send();

            let word = new db.Word({
                _id: uuidv4(),
                account: req.session.accountId,
                language: lesson.language,
                lesson: lesson._id,
                strength: 'weak',
                data: body.data
            })
            word.save();
            return res.json({ id: word._id });
        })
    })

    app.put("/api/words/:wordId", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const body = req.body;
        db.Word.findOne({ _id: req.params.wordId, account: req.session.accountId }, (err, word) => {
            if (word == null)
                return res.status(404).send();

            if (body.data) {
                utils.copyNonNull(body.data, word.data);
                word.save();
                return res.status(200).send();
            }
        })
    })

    app.delete("/api/words/:wordId", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        db.Word.deleteOne({ _id: req.params.wordId, account: req.session.accountId }, (err, r) => {
            return res.status(r.deletedCount == 0 ? 404 : 200).send();
        })
    })

}