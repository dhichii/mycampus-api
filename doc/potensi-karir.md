# Potensi Karir API Spec

## Add Potensi Karir
Endpoit: POST /api/v1/potensi-karir\
Login: required

Request Type: application/json

Request Body:
```json
{
  "nama": "example"
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


## GET All Potensi Karir
Endpoint: GET /api/v1/potensi-karir\
Login: required

Query Param:
- key: search\
  type: number\
  required: false
- key: limit\
  type: number\
  required: false
- key: page\
  type: number\
  required: false

Response Body (Success):
```json
  {
    "status": "success",
    "limit": 10,
    "total_page": 1,
    "total_result": 2,
    "page": 1,
    "data": [
      {
        "id": 1,
        "nama": "EXAMPLE 1"
      },
      {
        "id": 2,
        "nama": "EXAMPLE 2"
      }
    ]
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

## Edit Potensi Karir By Id
Endpoint: PUT /api/v1/potensi-karir/{id}\
Login: required

Request Type: application/json

Request Body:
```json
{
  "nama": "example"
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

## Delete Potensi Karir By Id
Endpoint: DELETE /api/v1/potensi-karir/{id}\
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
