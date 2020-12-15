const config = require("../conf/kanjiclub.json");

const express = require("express");
const session = require('express-session')
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const db = require('./database.js');

/* Configure Express */
var app = express()
app.set('trust proxy', 1)

// Debug CORS
app.use(cors({credentials: true, origin: config.network.corsOrigin}))

app.use(bodyParser.json());
app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config.session.secure },
    store: new MongoStore({ mongooseConnection: db.getConnection() })
}))

app.listen(config.network.port, () => {
    console.log("Server running on port " + config.network.port);
})

/* Connect to database */
db.connect(config.db.url)

/* Endpoint implementations */
require('./api/accounts.js')(app, db)
require('./api/languages.js')(app, db)
require('./api/lessons.js')(app, db)
require('./api/practice.js')(app, db)
require('./api/stats.js')(app, db)
require('./api/words.js')(app, db)
require('./api/notes.js')(app, db)