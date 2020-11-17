# Words API

Words are identified using their randomly generated word id

## Fetch words
To get all words in a lesson, omit `strength`, and to get all words with a specific strength, omit `lesson`.
```
GET /api/words?strength={wordStrength}&lesson={lessonId}
```
```json
{
	"words": [ WordInfo ]
}
```

## Create word
```
POST /api/words/new?lesson={lessonId}
```
```
{ WordInfo }
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
{ WordInfo }
```

## Delete word
```
DELETE /api/words/{wordId}
```