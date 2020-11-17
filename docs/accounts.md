# Accounts API

## Create account
```
POST /api/accounts/new
```

```json
{
	"email": "",
	"username": "",
	"password": ""
}
```
```json
{
	"reason": ""
}
```

## Log in
```
POST /api/accounts/login
```

```json
{
	"user": "",
	"password": ""
}
```


## Get settings
```
GET /api/accounts/me
```

```json
{
	"currentLanguage": "",
	"practiceOptions": PracticeOptions
}
```

## Change settings
```
PUT /api/accounts/me
```

```json
{
	"currentLanguage": "",
	"practiceOptions": PracticeOptions
}
```