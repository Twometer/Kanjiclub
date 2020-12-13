# Words API

Words are identified using their randomly generated word id

## Get words
Gets a list of words from your account
```
GET /api/words
```
```json
{
	"words": [ WordInfo ]
}
```

This endpoint has multiple query parameters to filter the returned words:

 - `lang`: Filter by language code
 - `strength`: Filter by word strength. May be `weak`, `medium`, `strong`
 - `lesson`:  Filter by lesson id.
 - `query`: Search in the contents of the word (any one of the four content fields)
 

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