const config = require("../conf/kanjiclub.json");
const languages = require("../conf/languages.json");

const express = require("express");
const session = require('express-session')
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const { v4: uuidv4 } = require('uuid');

const hash = require('./hash.js');
const db = require('./database.js');

/* Configure Express */
var app = express()
app.set('trust proxy', 1)
app.use(bodyParser.json());
app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: config.session.secure },
    store: new MongoStore({ mongooseConnection: db.getConnection() })
}))

app.listen(config.network.port, () => {
    console.log("Server running on port " + config.network.port);
})

/* Connect to database */
db.connect(config.db.url)

/* Accounts API */
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

    db.Account.findOne({ _id: req.session.accountId }, (err, account) => {
        return res.json(account.settings);
    })
})

function copyIfExists(src, dst) {
    for (var key in dst) {
        var val = src[key];

        if (val === null || val === undefined)
            continue;

        dst[key] = val;
    }
}

app.put("/api/accounts/me", (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.status(401).send();
    }

    const body = req.body;
    db.Account.findOne({ _id: req.session.accountId }, (err, account) => {
        copyIfExists(body, account.settings);
        account.save();
        return res.status(200).send();
    })
})

/* Languages API */
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
    res.json(languages)
})

/* Lessons API */
app.get("/api/lessons", (req, res, next) => {

})

app.post("/api/lessons/new", (req, res, next) => {

})

app.put("/api/lessons/:lessonId", (req, res, next) => {

})

app.delete("/api/lessons/:lessonId", (req, res, next) => {

})

app.post("/api/lessons/:lessonId/import", (req, res, next) => {

})

/* Practice API */
app.post("/api/practice/:languageCode/new", (req, res, next) => {

})

app.post("/api/practice/:languageCode/complete", (req, res, next) => {

})

/* Stats API */
app.get("/api/stats", (req, res, next) => {

})

/* Words API */
app.get("/api/words", (req, res, next) => {

})

app.post("/api/words/new", (req, res, next) => {

})

app.put("/api/words/:wordId", (req, res, next) => {

})

app.delete("/api/words/:wordId", (req, res, next) => {

})