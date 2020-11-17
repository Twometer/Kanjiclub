var config = require("../conf/kanjiclub.json");
var languages = require("../conf/languages.json");

var express = require("express");
var session = require('express-session')
var database = require('./database.js')
const MongoStore = require('connect-mongo')(session);

var app = express()

/* Configure Express */
app.set('trust proxy', 1)
app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: config.session.secure },
    store: new MongoStore({ mongooseConnection: database.getConnection() })
}))

app.listen(config.network.port, () => {
    console.log("Server running on port " + config.network.port);
})

database.connect(config.db.url)

/* Accounts API */
app.post("/api/accounts/new", (req, res, next) => {

})

app.post("/api/accounts/login", (req, res, next) => {

})

app.get("/api/accounts/me", (req, res, next) => {

})

app.put("/api/accounts/me", (req, res, next) => {

})

/* Languages API */
app.post("/api/languages/new", (req, res, next) => {

})

app.get("/api/languages", (req, res, next) => {

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