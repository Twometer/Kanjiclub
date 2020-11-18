# Languages API
Languages are identified by their language code, which is a 2-letter ISO code (`ISO-639-1`)

## Add new language
```
POST /api/languages/new
```

```json
{
	"languageCode": ""
}
```

## Get list of the users languages
```
GET /api/languages
```

```json
[ 
	{
		"code": "languageCode",
		"name": "languageName"
	}
]
```

## Get list of all supported languages
```
GET /api/languages/all
```

```json
[
	{
		"<code>": "<name>"
	}
]
```