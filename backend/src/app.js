var express = require("express");
var app = express()

app.listen(9080, () => {
    console.log("Server running on port 9080");
})

/* Accounts API */
app.post("/api/accounts/new", (req, res, next) => {

})

app.post("/api/accounts/login", (req, res, next) => {

})

app.get("/api/accounts/me", (req, res, next) => {

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
app.post("/api/practice/new", (req, res, next) => {

})

app.post("/api/practice/complete", (req, res, next) => {

})

/* Stats API */
app.get("/api/stats", (req, res, next) => {

})

app.get("/api/stats/:wordStrength", (req, res, next) => {

})

/* Words API */
app.get("/api/words/:lessonId", (req, res, next) => {

})

app.post("/api/words/:lessonId/new", (req, res, next) => {

})

app.put("/api/words/:lessonId/:wordId", (req, res, next) => {

})

app.delete("/api/words/:lessonId/:wordId", (req, res, next) => {

})