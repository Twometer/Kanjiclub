# Database

## Accounts
```json
{
    "_id": "",
    "email": "",
    "username": "",
    "password": "",
    "createdOn": Date,
    "languages": [],
    "stats": {
        "lastLogin": Date,
        "lastPractice": Date,
    },
    "settings": {
        "currentLanguage": "",
        "includeSynonyms": true,
        "randomizeDir": true,
        "ignoreCase": true
    }
}
```

## Lessons
```json
{
    "_id": "",
    "name": "",
    "account": Account.id,
    "language": "",
    "createdOn": Date
}
```

## Words
```json
{
    "_id": "",
    "account": Account.id,
    "language": "",
    "lesson": Lesson.id,
    "createdOn": "",
    "strength": "weak",
    "stats": {
        "lastPracticed": Date,
        "previouslyCorrect": false
    },
    "data": {
        "foreign": "",
        "synonym": "",
        "gender": "",
        "native": "",
        "comment": ""
    }
}
```