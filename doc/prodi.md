# Prodi API Spec

## Add Prodi
Endpoint: POST /api/v1/prodi\
Login: required

Request Type: application/json

Request Body:
```json
{
  "nama": "example",
  "id_universitas": 1,
  "kode_prodi": 12345678,
  "jenjang": "S1",
  "status": "Aktif",
  "akreditasi": "Sangat Baik",
  "biaya_pendaftaran": 200000.00,
  "ukt": 15000000.00,
  "keterangan": "example",
  "potensi_karir": [
    {
      "nama": "example"
    }
  ]
}
```

Response Body (Success):
```json
{
  "status": "success",
  "id": "e6314752-c753-47dc-bc82-eae480d1b094"
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

## GET All Prodi
Endpoint: GET /api/v1/prodi\
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
- key: universitas\
  type: number\
  required: false
- key: status\
  type: string\
  required: false
- key: min_ukt
  type: number\
  required: false
- key: max_ukt
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
        "nama": "EXAMPLE 1",
        "universitas": {
          "id": 1,
          "nama": "EXAMPLE",
          "jenis": "NEGERI",
          "logo_url": "example.png"
        },
        "kode_prodi": 12345678,
        "jenjang": "S1",
        "status": "Aktif",
        "akreditasi": "Sangat Baik",
        "biaya_pendaftaran": 200000.00,
        "ukt": 15000000.00,
        "potensi_karir": [
          {
            "id": 1,
            "nama": "EXAMPLE"
          }
        ]
      },
      {
        "id": "e6314752-c753-47dc-bc82-eae480d1b094",
        "nama": "EXAMPLE 2",
        "universitas": {
          "id": 1,
          "nama": "EXAMPLE",
          "jenis": "SWASTA",
          "logo_url": "example.png"
        },
        "kode_prodi": 12345678,
        "jenjang": "S1",
        "status": "Aktif",
        "akreditasi": "Sangat Baik",
        "biaya_pendaftaran": 200000.00,
        "ukt": 15000000.00,
        "potensi_karir": [
          {
            "id": 1,
            "nama": "EXAMPLE"
          }
        ]
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

## Get Prodi By Id
Endpoint: GET /api/v1/prodi/{id}\
Login: required

Response Body (Success):
```json
{
  "status": "success",
  "data": {
    "id": "e6314752-c753-47dc-bc82-eae480d1b094",
    "nama": "EXAMPLE 1",
    "universitas": {
          "id": 1,
          "nama": "EXAMPLE",
          "jenis": "NEGERI",
          "logo_url": "example.png"
    },
    "kode_prodi": 12345678,
    "jenjang": "S1",
    "status": "Aktif",
    "akreditasi": "Sangat Baik",
    "biaya_pendaftaran": 200000.00,
    "ukt": 15000000.00,
    "keterangan": "example",
    "potensi_karir": [
      {
        "id": 1,
        "nama": "example"
      }
    ]
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

## Edit Prodi By Id
Endpoint: PUT /api/v1/prodi/{id}\
Login: required

Request Type: application/json

Request Body:
```json
{
  "nama": "example",
  "id_universitas": 1,
  "kode_prodi": 12345678,
  "jenjang": "S1",
  "status": "Aktif",
  "akreditasi": "Sangat Baik",
  "biaya_pendaftaran": 200000.00,
  "ukt": 15000000.00,
  "keterangan": "example"
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

## Edit Prodi Potensi Karir By Id
Endpoint: PATCH /api/v1/prodi/{id}/potensi-karir\
Login: required

Request Type: application/json

Request Body:
```json
{
  "potensi_karir": [
    {
      "nama": "example"
    },
    {
      "nama": "example 2"
    }
  ]
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

## Delete Prodi By Id
Endpoint: DELETE /api/v1/prodi/{id}\
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
