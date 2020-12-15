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
        "streak": Number
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
    "createdOn": Date,
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

## Notes
```json
{
    "_id": "",
    "account": Account.id,
    "language": "",
    "createdOn": Date,
    "lastModified": Date,
    "title": "",
    "content": ""
}
```