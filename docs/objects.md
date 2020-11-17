# API objects

## `LessonInfo`
```json
{
	"id": "",
	"name": "",
	"createdOn": "",
	"language": ""
}
```

## `WordInfo`
```json
{
	"id": "",
	"lesson": "",
	"language": "",
	"createdOn": "",
	"lastPracticed": "",
	"strength": "weak",
	"data": {
		"foreign": "",
		"synonym": "",
		"gender": "",
		"native": "",
		"comment": ""
	}
}
```

## `WordStrength`
- weak
- medium
- strong

## `PracticeOptions`
```json
{
	"includeSynonyms": true,
	"randomizeDir": true,
	"ignoreCase": true
}
```