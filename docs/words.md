# Words API

## `GET /api/words/{lessonId}`
Get words in lesson

```json
{
	"words": [ WordInfo ]
}
```

## `POST /api/words/new`
New word in lesson

Send `WordInfo`

## `PUT /api/words/{wordId}`
Update word in lesson

Send `WordInfo` with only the values that should be changed

## `DELETE /api/words/{wordId}`
Delete word from lesson

## `WordInfo`
```json
{
	"id": "",
	"lesson": "",
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