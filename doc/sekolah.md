# Sekolah API Spec

## Add Sekolah
Endpoint: POST /api/v1/sekolah

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
  "status": "success",
  "data": {
    "id": "e6314752-c753-47dc-bc82-eae480d1b094",
    "nama": "EXAMPLE"
  }
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

## Get All Sekolah
Endpoint: GET /api/v1/sekolah

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
        "nama": "Example 1"
      },
      {
        "id": "e6314752-c753-47dc-bc82-eae480d1b094",
        "nama": "Example 2"
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

## Edit Sekolah By Id
Endpoint: PUT /api/v1/sekolah/{id}
- key: id\
  type: uuid

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

## Delete Sekolah By Id
Endpoint: DELETE /api/v1/sekolah/{id}
- key: id\
  type: uuid

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