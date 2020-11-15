# Lessons API

## `GET /api/lessons`
Get all lessons

```json
{
	"lessons": [ LessonInfo ]
}
```

## `POST /api/lessons/new`
Create new lesson

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

## `PUT /api/lessons/{lessonId}`
Rename lesson

```json
{
	"name": ""
}
```

## `DELETE /api/lessons/{lessonId}`
Delete a session

## `POST /api/lessons/{lessonId}/import`
Import vocabulary into lesson

Direct upload of binary vocab data


## `LessonInfo`
```json
{
	"id": "",
	"name": "",
	"createDate": "",
	"size": 0
}
```