const utils = require('../util/utils.js');
const { v4: uuidv4 } = require('uuid');

module.exports = (app, db) => {

    app.get("/api/lessons", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const language = req.query.lang;
        if (language == null) {
            return res.status(400).send();
        }

        db.Lesson.find({ account: req.session.accountId, language: language }, (err, lessons) => {
            const response = lessons.map(l => {
                return {
                    id: l._id,
                    name: l.name,
                    language: l.language,
                    createdOn: l.createdOn
                }
            })
            return res.json(response);
        });
    })

    app.post("/api/lessons/new", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const body = req.body;
        if (!body.name || !body.language) {
            return res.status(400).send();
        }

        db.Lesson.countDocuments({ name: body.name, account: req.session.accountId, language: body.language }, (err, count) => {
            if (count != 0)
                return res.status(403).json({ reason: "Lesson already exists" });

            let lesson = new db.Lesson({
                _id: uuidv4(),
                name: body.name,
                account: req.session.accountId,
                language: body.language
            })
            lesson.save();
            return res.status(200).send();
        })
    })

    app.put("/api/lessons/:lessonId", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const lessonId = req.params.lessonId;
        db.Lesson.findOne({ _id: lessonId, account: req.session.accountId }, (err, lesson) => {
            if (lesson === null) {
                return res.status(404).send();
            }

            utils.copyNonNullByKeys(req.body, lesson, ['name', 'language']);
            lesson.save();
            return res.status(200).send();
        })
    })

    app.delete("/api/lessons/:lessonId", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const lessonId = req.params.lessonId;
        db.Lesson.deleteOne({ _id: lessonId, account: req.session.accountId }, (err, r) => {
            return res.status(r.deletedCount == 0 ? 404 : 200).send();
        })
    })

    app.post("/api/lessons/:lessonId/import", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }
        // TODO importer
    })

}