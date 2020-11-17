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

## Log out
```
POST /api/accounts/logout
```

## Get settings
```
GET /api/accounts/me
```

```json
{
	"currentLanguage": "",
	"includeSynonyms": true,
	"randomizeDir": true,
	"ignoreCase": true
}
```

## Change settings
```
PUT /api/accounts/me
```

```json
{
	"currentLanguage": "",
	"includeSynonyms": true,
	"randomizeDir": true,
	"ignoreCase": true
}
```