# Practice API

## `POST /api/practice/new`
New practice

```json
{
	"lessons": [ String ]
}
```
```json
{
	"words": [ WordInfo ]
}
```

## `POST /api/practice/complete`
On practice completed

```json
{
	"words": [
		{ "wordId": "", "correct": false }
	]
}
```
Generic response