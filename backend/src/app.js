var express = require("express");
var app = express()

app.listen(9080, () => {
    console.log("Server running on port 9080");
})

app.get("/api", (req, res, next) => {
    res.send("online");
})

app.post("/api/accounts/new", (req, res, next) => {

})

app.post("/api/accounts/login", (req, res, next) => {

})

// app.get("/api/lessons")