# Authentication API Spec

## Refresh
Endpoint: PUT /api/v1/authentication/refresh\
Login: required

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
