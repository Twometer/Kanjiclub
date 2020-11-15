# Lessons API

### `GET /api/lessons`: Get all lessons
```json
{
	"lessons": [ LessonInfo ]
}
```

### `POST /api/lessons/new`: Create new lesson
```json
{
	"name": ""
}
```
```json
{
	"id": ""
}
```

### `POST /api/lessons/{lessonId}/import`: Import vocabulary into lesson
Direct upload of binary vocab data


### `LessonInfo` Object
```json
{
	"id": "",
	"name": "",
	"createDate": "",
	"size": 0
}
```