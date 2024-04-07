# Pihak Sekolah API Spec

## GET All Pihak Sekolah
Endpoint: GET /api/v1/pihak-sekolah\
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
- key: sekolah\
  type: string\
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
        "nama": "EXAMPLE 1",
        "email": "example1@gmail.com",
        "jabatan": "KEPALA SEKOLAH",
        "jenis_kelamin": "L",
        "created_at": "2024-04-07T06:53:09.538Z",
        "asal_sekolah": {
          "id": "e6314752-c753-47dc-bc82-eae480d1b094",
          "nama": "SEKOLAH EXAMPLE 1"
        }
      },
      {
        "id": "e6314752-c753-47dc-bc82-eae480d1b094",
        "nama": "EXAMPLE 2",
        "email": "example2@gmail.com",
        "jenis_kelamin": "P",
        "created_at": "2024-04-07T06:53:09.538Z",
        "asal_sekolah": {
          "id": "e6314752-c753-47dc-bc82-eae480d1b094",
          "nama": "SEKOLAH EXAMPLE 2"
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

## Get Pihak Sekolah By Id
Endpoint: GET /api/v1/pihak-sekolah/{id}\
Login: required

Request Type: application/json

Request Body:
```json
{
  "status": "success",
  "data": {
    "id": "e6314752-c753-47dc-bc82-eae480d1b094",
    "nama": "EXAMPLE 1",
    "email": "example1@gmail.com",
    "jabatan": "KEPALA SEKOLAH",
    "jenis_kelamin": "L",
    "created_at": "2024-04-07T06:53:09.538Z",
    "asal_sekolah": {
      "id": "e6314752-c753-47dc-bc82-eae480d1b094",
      "nama": "SEKOLAH EXAMPLE 1"
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

## Edit Pihak Sekolah By Id
Endpoint: PUT /api/v1/pihak-sekolah/{id}\
Login: required

Request Type: application/json

Request Body:
```json
{
  "nama": "example",
  "jenis_kelamin": "L" or "P",
  "jabatan": "KEPALA SEKOLAH",
  "sekolah": "SEKOLAH EXAMPLE X",
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

## Delete Pihak Sekolah By Id
Endpoint: DELETE /api/v1/pihak-sekolah/{id}\
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
