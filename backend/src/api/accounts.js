const utils = require('../util/utils.js');
const hash = require('../util/hash.js');
const { v4: uuidv4 } = require('uuid');

module.exports = (app, db) => {

    function cookieRememberMe(cookie) {
        let month = 30 * 24 * 60 * 60 * 1000;
        cookie.expires = new Date(Date.now() + month);
    }

    app.post("/api/accounts/new", (req, res, next) => {
        const body = req.body;

        if (!body.email || !body.username || !body.password) {
            return res.status(400).send();
        }

        if (body.username.length > 20) {
            return res.status(400).json({ reason: "Username must not be longer than 20 characters" });
        }

        db.Account.countDocuments({ username: body.username }, (err, count) => {
            if (count != 0)
                return res.status(403).json({ reason: "Username already taken" });

            hash(body.password, body.email, hashedPassword => {
                let account = new db.Account({
                    _id: uuidv4(),
                    email: body.email,
                    username: body.username,
                    password: hashedPassword
                })
                account.save();

                return res.status(200).send();
            })
        })
    })

    app.post("/api/accounts/login", (req, res, next) => {
        if (req.session.loggedIn) {
            return res.status(403).send();
        }

        const body = req.body;
        if (!body.username || !body.password) {
            return res.status(400).send();
        }

        db.Account.findOne({ username: body.username }, (err, account) => {
            if (account == null)
                return res.status(403).send();

            hash(body.password, account.email, hashedPassword => {

                if (account.password == hashedPassword) {
                    req.session.loggedIn = true;
                    req.session.accountId = account._id;

                    if (body.rememberMe) {
                        req.session.rememberMe = true;
                        cookieRememberMe(req.session.cookie);
                    }

                    account.stats.lastLogin = Date.now()
                    account.save()

                    return res.status(200).send();
                } else {
                    return res.status(403).send();
                }

            })
        })
    })

    app.post("/api/accounts/logout", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }
        req.session.loggedIn = false;
        req.session.accountId = null;
        return res.status(200).send();
    })

    app.get("/api/accounts/me", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        if (req.session.rememberMe)
            cookieRememberMe(req.session.cookie);

        db.Account.findOne({ _id: req.session.accountId }, (err, account) => {
            return res.json({
                username: account.username,
                settings: account.settings
            });
        })
    })

    app.put("/api/accounts/settings", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        const body = req.body;
        db.Account.findOne({ _id: req.session.accountId }, (err, account) => {
            utils.copyNonNull(body, account.settings);
            account.save();
            return res.status(200).send();
        })
    })

}