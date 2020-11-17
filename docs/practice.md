# Practice API

The practice API is used to generate a new test for the user. Practices are not persisted to the database, only their results.

## Generate new practice
```
POST /api/practice/{languageCode}/new
```

```json
{
	"target": "lesson",
	"lessons": [ lessonId ]
}

OR

{
	"target": "word_group",
	"strength": "weak"
}
```

```json
{
	"words": [ WordInfo ]
}
```

## Practice completed
```
POST /api/practice/{languageCode}/complete
```

```json
{
	"words": [
		{ "wordId": "", "correct": false }
	]
}
```