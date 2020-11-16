# Overview

## About
Kanjiclub is a cloud-based open source tool for learning vocabulary (primarily Japanese).

## API Doc Formatting
HTTP requests are formatted like this:

`METHOD /url/to/endpoint`
Description

```
request
```
```
response
```

If no response is defined, then the generic response is used

## Generic response
A generic response only signifies a status using HTTP status codes, without a JSON body.

## Endpoints
- `/api/accounts`
- `/api/stats`
- `/api/languages`
- `/api/lessons`
- `/api/words`
- `/api/practice`

## Relations
- An account has languages and stats
- A language has lessons
- A lesson has words