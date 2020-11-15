var express = require("express");
var app = express()

app.listen(9080, () => {
    console.log("Server running on port 9080");
})

app.get("/", (req, res, next) => {
    res.json(["Test", "Test2", "Test3"]);
})