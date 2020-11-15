# Accounts API

## `POST /api/accounts/new`
Create new account

```json
{
	"email": "",
	"username": "",
	"password": ""
}
```

## `POST /api/accounts/login`
Log in 

```json
{
	"user": "",
	"password": ""
}
```
```json
{
	"token": ""
}
```

## `GET /api/accounts/me`
Info about myself

```json
{
	"token": "",
	"username": "",
	"email": ""
}
```