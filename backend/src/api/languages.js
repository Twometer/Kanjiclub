const languages = require("../../conf/languages.json");

module.exports = (app, db) => {

    app.post("/api/languages/new", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const body = req.body;
        if (!body.languageCode) {
            return res.status(400).send();
        }

        if (!(body.languageCode in languages)) {

            return res.status(400).json({ "reason": "Unknown language" });

        } else {

            db.Account.findOne({ _id: req.session.accountId }, (err, account) => {

                if (account.languages.includes(body.languageCode)) {
                    return res.status(409).json({ "reason": "Language already exists" })
                } else {
                    account.languages.push(body.languageCode);

                    if (account.settings.currentLanguage == null)
                        account.settings.currentLanguage = body.languageCode;

                    account.save();
                    return res.status(200).send();
                }

            })

        }
    })

    app.get("/api/languages", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        db.Account.findOne({ _id: req.session.accountId }, (err, account) => {
            return res.json(account.languages);
        })
    })

    app.get("/api/languages/all", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        res.json(languages)
    })

}