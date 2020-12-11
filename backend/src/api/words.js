const utils = require('../util/utils.js');
const { v4: uuidv4 } = require('uuid');
const strength = require('../util/strength');

function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = (app, db) => {

    app.get("/api/words", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const query = req.query;

        let dbQuery = {
            account: req.session.accountId
        };

        if (query.lang) dbQuery.language = query.lang;
        if (query.strength) dbQuery.strength = strength[query.strength];
        if (query.lesson) dbQuery.lesson = query.lesson;

        if (query.query) {
            let searchString = query.query.trim();
            if (searchString.length > 0) {
                var queryObj = {
                    $regex: escapeRegex(searchString),
                    $options: 'i'
                };
                dbQuery.$or = [{ "data.foreign": queryObj }, { "data.synonym": queryObj }, { "data.native": queryObj }, { "data.comment": queryObj }];
            }
        }

        db.Word.find(dbQuery, (err, words) => {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            const response = words.map(w => {
                return {
                    id: w._id,
                    lesson: w.lesson,
                    language: w.language,
                    createdOn: w.createdOn,
                    strength: strength[w.strength],
                    data: w.data
                }
            })

            return res.json(response);
        });
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
                strength: strength.weak,
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