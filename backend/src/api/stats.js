const strength = require('../util/strength.js')

module.exports = (app, db) => {

    app.get("/api/stats", async (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }

        let user = await db.Account.findOne({ _id: req.session.accountId });
        let weakWords = await db.Word.countDocuments({ account: req.session.accountId, strength: strength.weak });
        let mediumWords = await db.Word.countDocuments({ account: req.session.accountId, strength: strength.medium });
        let strongWords = await db.Word.countDocuments({ account: req.session.accountId, strength: strength.strong });
        res.json({
            streak: user.stats.streak,
            weak: weakWords,
            medium: mediumWords,
            strong: strongWords
        });
    })

}