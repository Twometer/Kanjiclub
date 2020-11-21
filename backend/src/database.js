const mongoose = require('mongoose')

exports.Account = mongoose.model('Account', {
    _id: String,
    email: String,
    username: String,
    password: String,
    createdOn: { type: Date, default: Date.now },
    languages: [ String ],
    stats: {
        lastLogin: Date,
        lastPractice: Date,
        streak: { type: Number, default: 0 }
    },
    settings: {
        currentLanguage: String,
        includeSynonyms: { type: Boolean, default: true },
        randomizeDir: { type: Boolean, default: true },
        ignoreCase: { type: Boolean, default: true }
    }
})

exports.Lesson = mongoose.model('Lesson', {
    _id: String,
    name: String,
    account: String,
    language: String,
    createdOn: { type: Date, default: Date.now }
})

exports.Word = mongoose.model('Word', {
    _id: String,
    account: String,
    language: String,
    lesson: String,
    createdOn: { type: Date, default: Date.now },
    strength: Number,
    stats: {
        lastPracticed: Date,
        previouslyCorrect: Boolean
    },
    data: {
        foreign: String,
        synonym: String,
        gender: String,
        native: String,
        comment: String
    }
})

exports.connect = (url) => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Connected to MongoDB"));
}

exports.getConnection = () => {
    return mongoose.connection;
}