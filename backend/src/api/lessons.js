module.exports = (app, db) => {

    app.get("/api/lessons", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }
    
        const language = req.query.lang;
    
    })
    
    app.post("/api/lessons/new", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }
    
        const body = req.body;
    
    })
    
    app.put("/api/lessons/:lessonId", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }
    
    })
    
    app.delete("/api/lessons/:lessonId", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }
    
    })
    
    app.post("/api/lessons/:lessonId/import", (req, res, next) => {
        if (!req.session.loggedIn) {
            return res.status(401).send();
        }
        
    })

}