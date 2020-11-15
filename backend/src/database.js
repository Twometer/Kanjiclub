var mongoose = require('mongoose')

module.exports.connect = function(url) {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(function() {
            console.log("Connected to MongoDB")
        })
}

module.exports.getConnection = function() {
    return mongoose.connection;
}