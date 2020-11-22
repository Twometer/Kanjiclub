const { strong } = require('../util/strength.js');
const strength = require('../util/strength.js')

module.exports = (app, db) => {

    app.get("/api/stats", async (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        let user = await db.Account.findOne({ _id: req.session.accountId });
        if (user == null) // wut?
            return res.status(500).send();

        let query = { account: req.session.accountId, language: user.settings.currentLanguage };

        query.strength = strength.weak;
        let weakWords = await db.Word.countDocuments(query);

        query.strength = strength.medium;
        let mediumWords = await db.Word.countDocuments(query);

        query.strength = strength.strong;
        let strongWords = await db.Word.countDocuments(query);

        res.json({
            streak: user.stats.streak,
            weak: weakWords,
            medium: mediumWords,
            strong: strongWords
        });
    })

}