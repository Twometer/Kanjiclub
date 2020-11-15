# Stats API

### `GET /api/stats`: Stats overview
```json
{
	"streak": 0,
	"strong": 0,
	"medium": 0,
	"weak": 0
}
```

### `GET /api/stats/{wordStrength}`: Retrieve all words with that strength
```json
{
	"words": [ WordInfo ]
}
```