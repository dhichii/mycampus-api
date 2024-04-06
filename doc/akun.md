# Akun API Spec

## Login
Endpoint: POST /api/v1/akun/login

Request Type: application/json

Request Body:
```json
{
  "email": "example@gmail.com",
  "password": "12345678"
}
```
Response Cookie:
- Authorization: Bearer%20<token>
- r: Bearer%20<token>

Response Body (Success):
```json
{
  "status": "success"
}
```

Response Body (Failed):
```json
{
  "errors": [
    {
      "message": "Internal Server Error"
    }
  ]
}
```

## Logout
Endpoint: POST /api/v1/akun/logout\
Login: required

Response Body (Success):
```json
  {
    "status": "success"
  }
```

Response Body (Failed):
```json
{
  "errors": [
    {
      "message": "Internal Server Error"
    }
  ]
}
```

## Change Email
Endpoint: PATCH /api/v1/akun/email\
Login: required

Request Type: application/json

Request Body:
```json
{
  "email": "example@gmail.com"
}
```

Response Body (Success):
```json
{
  "status": "success"
}
```

Response Body (Failed):
```json
{
  "errors": [
    {
      "message": "Internal Server Error"
    }
  ]
}
```

## Change Password
Endpoint: PATCH /api/v1/akun/password\
Login: required

Response Body (Success):
```json
{
  "status": "success"
}
```

Response Body (Failed):
```json
{
  "errors": [
    {
      "message": "Internal Server Error"
    }
  ]
}
```