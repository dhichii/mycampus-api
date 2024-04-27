# Universitas API Spec

## Add Universitas
Endpoint: POST /api/v1/universitas

Request Type: multipart/form-data

Request Body:

- Key: nama\
  type: string
- Key: jenis\
  type: string
- Key: alamat\
  type: string
- Key: keterangan\
  type: string
- Key: logo\
  type: image

Response Body (Success):
```json
{
  "data": {
    "id": 1,
    "nama": "EXAMPLE",
    "jenis": "NEGERI",
    "alamat": "Example",
    "keterangan": "Example",
    "logo_url": "example.png"
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

## Get All Universitas
Endpoint: GET /api/v1/universitas
Response Body (Success):
```json
  {
    "data": [
      {
        "id": 1,
        "nama": "Example 1",
        "alamat": "EXAMPLE",
        "jenis": "NEGERI",
        "keterangan": "Example",
        "logo_url": "example.png"
      },
      {
        "id": 2,
        "nama": "EXAMPLE 2",
        "jenis": "SWASTA",
        "alamat": "Example",
        "keterangan": "Example",
        "logo_url": "example.png"
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

## Get Universitas By Id
Endpoint: GET /api/v1/universitas/{id}
- key: id\
  type: number
Response Body (Success):
```json
{
  "data": {
    "id": 1,
    "nama": "EXAMPLE",
    "jenis": "SWASTA",
    "alamat": "Example",
    "keterangan": "Example",
    "logo_url": "example.png"
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

## Edit Universitas By Id
Endpoint: PUT /api/v1/universitas/{id}
- key: id\
  type: number

Request Type: multipart/form-data

Request Body:

- Key: nama\
  type: string
- Key: jenis\
  type: string
- Key: alamat\
  type: string
- Key: keterangan\
  type: string

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

## Delete Universitas By Id
Endpoint: DELETE /api/v1/universitas/{id}
- key: id\
  type: number

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

## Edit Logo Universitas By Id
Endpoint: PATCH /api/v1/universitas/{id}/logo
- key: id\
  type: number

Request Type: multipart/form-data

Request Body:

- Key: logo\
  type: image

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