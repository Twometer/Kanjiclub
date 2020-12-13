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
	"password": "",
	"rememberMe": false
}
```

## Log out
```
POST /api/accounts/logout
```

## Get info about user
```
GET /api/accounts/me
```

```json
{
	"username": "",
	"settings": {
		"currentLanguage": "",
		"includeSynonyms": true,
		"randomizeDir": true,
		"ignoreCase": true
	}
}
```

## Change settings
```
PUT /api/accounts/settings
```

```json
{
	"currentLanguage": "",
	"includeSynonyms": true,
	"randomizeDir": true,
	"ignoreCase": true
}
```