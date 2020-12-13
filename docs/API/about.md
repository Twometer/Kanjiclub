# About the Web API

The web API is a collection of REST endpoints that the VueJS app uses to communicate with
the server. Endpoints of this API are documented here

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