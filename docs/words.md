# Words API

Words are identified using their randomly generated word id

## Get words
To get all words in a lesson, omit `strength`, and to get all words with a specific strength, omit `lesson`.
```
GET /api/words?lang={languageCode}&strength={wordStrength}&lesson={lessonId}
```
```json
{
	"words": [ WordInfo ]
}
```

## Create word
```
POST /api/words/new
```
```
{
	"lesson": "",
	"data": {
		"foreign": "",
		"synonym": "",
		"gender": "",
		"native": "",
		"comment": ""
	}
}
```
```
{
	"id": ""
}
```

## Update word
```
PUT /api/words/{wordId}
```
```
{
	"data": {
		"foreign": "",
		"synonym": "",
		"gender": "",
		"native": "",
		"comment": ""
	}
}
```

## Delete word
```
DELETE /api/words/{wordId}
```