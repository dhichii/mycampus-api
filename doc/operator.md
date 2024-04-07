# Operator API Spec

## Add Operator
Endpoint: POST /api/v1/operator\
Login: required

Request Type: application/json

Request Body:
```json
{
  "email": "example@gmail.com",
  "password": "12345678",
  "nama": "example",
  "universitas": 1,
  "jenis_kelamin": "L" or "P"
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

## GET All Operator
Endpoint: GET /api/v1/operator\
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
        "id": "e6314752-c753-47dc-bc82-eae480d1b094",
        "nama": "Example 1",
        "email": "example1@gmail.com",
        "jenis_kelamin": "L",
        "created_at": "2024-04-07T06:53:09.538Z",
        "universitas": {
          "id": "1",
          "nama": "example"
        }
      },
      {
        "id": "e6314752-c753-47dc-bc82-eae480d1b094",
        "nama": "Example 2",
        "email": "example2@gmail.com",
        "jenis_kelamin": "P",
        "created_at": "2024-04-07T06:53:09.538Z",
        "universitas": {
          "id": "1",
          "nama": "example"
        }
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

## Get Operator By Id
Endpoint: GET /api/v1/operator/{id}\
Login: required

Request Type: application/json

Request Body:
```json
{
  "status": "success",
  "data": {
    "id": "e6314752-c753-47dc-bc82-eae480d1b094",
    "nama": "Example 2",
    "email": "example2@gmail.com",
    "jenis_kelamin": "P",
    "created_at": "2024-04-07T06:53:09.538Z",
    "universitas": {
          "id": "1",
          "nama": "example"
        }
  }
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

## Edit Operator By Id
Endpoint: PUT /api/v1/operator/{id}\
Login: required

Request Type: application/json

Request Body:
```json
{
  "nama": "example",
  "jenis_kelamin": "L" or "P",
  "universitas": 1
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

## Delete Operator By Id
Endpoint: DELETE /api/v1/operator/{id}\
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
