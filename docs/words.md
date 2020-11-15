# Words API

## `GET /api/words/{lessonId}`
Get words in lesson

```json
{
	"words": [ WordInfo ]
}
```

## `POST /api/words/{lessonId}/new`
New word in lesson

Send `WordInfo`

## `PUT /api/words/{lessonId}/{wordId}`
Update word in lesson

Send `WordInfo` with only the values that should be changed

## `WordInfo`
```json
{
	"id": "",
	"createdOn": "",
	"lastPracticed": "",
	"strength": "weak",
	"content": {
		"native": "",
		"kana": "",
		"kanji": "",
		"comment": ""
	}
}
```

## `WordStrength`
- weak
- medium
- strong