const { v4: uuidv4 } = require('uuid');

module.exports = (app, db) => {

    app.get("/api/notes", (req, res) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const language = req.query.lang;
        if (language == null) {
            return res.status(400).send();
        }

        db.Note.find({ account: req.session.accountId, language: language }, (err, notes) => {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            const response = notes.map(n => {
                return {
                    id: n._id,
                    language: n.language,
                    createdOn: n.createdOn,
                    lastModified: n.lastModified,
                    title: n.title
                };
            });
            return res.json(response);
        });
    })

    app.get("/api/notes/:noteId", (req, res) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const noteId = req.params.noteId;
        db.Note.findOne({ _id: noteId, account: req.session.accountId }, (err, note) => {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            if (note === null)
                return res.status(404).send();

            return res.json({ title: note.title, content: note.content });
        })
    })

    app.post("/api/notes/new", (req, res) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const body = req.body;
        if (!body.title || !body.language)
            return res.status(400).send();

        let note = new db.Note({
            _id: uuidv4(),
            account: req.session.accountId,
            language: body.language,
            title: body.title,
            content: ''
        });
        note.save();
        return res.json({ id: note._id })
    })

    app.put("/api/notes/:noteId", (req, res) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const body = req.body;
        const noteId = req.params.noteId;
        db.Note.findOne({ _id: noteId, account: req.session.accountId }, (err, note) => {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            if (note === null)
                return res.status(404).send();

            if (body.title)
                note.title = body.title;
            if (body.content)
                note.content = body.content;

            note.save();

            return res.status(200).send();
        })
    });

    app.delete("/api/notes/:noteId", (req, res) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const noteId = req.params.noteId;
        db.Note.deleteOne({ _id: noteId, account: req.session.accountId }, (err, r) => {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            if (r.deletedCount == 0)
                return res.status(404).send();

            return res.status(200).send();
        })
    });

}