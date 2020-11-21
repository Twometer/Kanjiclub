const importers = require('../importer/importers.js');
const utils = require('../util/utils.js');
const { v4: uuidv4 } = require('uuid');
const strength = require('../util/strength');

module.exports = (app, db) => {

    function createLesson(name, accountId, lang) {
        return new Promise((resolve, reject) => {

            db.Lesson.countDocuments({ name: name, account: accountId, language: lang }, (err, count) => {
                if (count != 0 || err) {
                    reject();
                    return;
                }

                let lesson = new db.Lesson({
                    _id: uuidv4(),
                    name: name,
                    account: accountId,
                    language: lang
                })
                lesson.save();
                resolve(lesson._id);
            })

        });
    }

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

    app.post("/api/lessons/new", async (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const body = req.body;
        if (!body.name || !body.language) {
            return res.status(400).send();
        }

        try {
            let id = await createLesson(body.name, req.session.accountId, body.language);
            return res.json({ id: id });
        } catch {
            return res.status(403).json({ reason: "Lesson already exists" });
        }
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
            if (r.deletedCount == 0) return res.status(404).send();

            db.Word.deleteMany({ lesson: lessonId }, (err, r) => {
                return res.status(200).send();
            })
        })
        
    })

    app.post("/api/lessons/import", async (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const body = req.body;
        if (!body.filename || !body.language || !body.content) {
            return res.status(400).send();
        }

        let filename = body.filename;
        let language = body.language;
        let dataUri = body.content;

        let extension = filename.substr(filename.lastIndexOf('.') + 1);
        let lessonName = filename.substr(0, filename.length - extension.length - 1);

        let result = await importers.import(extension, lessonName, dataUri);
        if (result == null)
            return res.status(422).send();

        let lessonId;
        try {
            lessonId = await createLesson(lessonName, req.session.accountId, language);
        } catch (e) {
            return res.status(403).json({ reason: 'Lesson exists' })
        }

        let wordObjects = result.map(data => {
            return {
                _id: uuidv4(),
                account: req.session.accountId,
                language: language,
                lesson: lessonId,
                strength: strength.weak,
                data: data
            }
        });

        db.Word.collection.insertMany(wordObjects, (err, docs) => {
            if (err) return res.status(500).send();
            else return res.status(200).send();
        })       
    })

}