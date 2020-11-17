# Overview

## About the app
Kanjiclub is an open-source cloud app for vocabulary training. Go to [kanjiclub.tk](https://kanjiclub.tk) to try it out for yourself.

## Web API
All pages that end with "API" document REST API endpoints. HTTP requests will be formatted like this:

### Formatting
**Endpoint name**  
Optional description
```
METHOD /endpoint/url
```
```
optional request body
```
```
optional response body
```

### Generic responses
A generic response is an HTTP response without a body. The status of the reply should be in the HTTP status code. Generic responses are omitted from the docs.

### Endpoints
- `/api/accounts`
- `/api/stats`
- `/api/languages`
- `/api/lessons`
- `/api/words`
- `/api/practice`