# Pendaftaran API Spec

## Add Pendaftaran
Endpoint: POST /api/v1/pendaftaran\
Login: required

Request Type: application/json

Request Body:
```json
{
  "id_prodi": "e6314752-c753-47dc-bc82-eae480d1b094",
  "jalur_pendaftaran": "Mandiri",
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

## GET All Pendaftaran
Endpoint: GET /api/v1/pendaftaran
Login: required

Query Param:
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
- key: nisn\
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
        "jalur_pendaftaran": "Mandiri",
        "status": "Menunggu",
        "created_at": "2024-04-07T06:53:09.538Z",
        "prodi": {
          "id": "e6314752-c753-47dc-bc82-eae480d1b094",
          "nama": "EXAMPLE 1",
          "universitas": {
            "id": "e6314752-c753-47dc-bc82-eae480d1b094",
            "nama": "EXAMPLE 1",
            "jenis": "NEGERI",
            "logo_url": "example.png"
          }
        },
        "pendaftar": {
          "id": "e6314752-c753-47dc-bc82-eae480d1b094",
          "nama": "EXAMPLE 2",
          "nisn": "0879780"
        }
      },
      {
        "id": "e6314752-c753-47dc-bc82-eae480d1b094",
        "jalur_pendaftaran": "Mandiri",
        "status": "Menunggu",
        "created_at": "2024-04-07T06:53:09.538Z",
        "prodi": {
          "id": "e6314752-c753-47dc-bc82-eae480d1b094",
          "nama": "EXAMPLE 1",
          "universitas": {
            "id": "e6314752-c753-47dc-bc82-eae480d1b094",
            "nama": "EXAMPLE 1",
            "jenis": "NEGERI",
            "logo_url": "example.png"
          }
        },
        "pendaftar": {
          "id": "e6314752-c753-47dc-bc82-eae480d1b094",
          "nama": "EXAMPLE 2",
          "nisn": "0879780"
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

## Get Pendaftaran By Id
Endpoint: GET /api/v1/pendaftaran/{id}\
Login: required

Response Body (Success):
```json
{
  "status": "success",
  "data": {
    "id": "e6314752-c753-47dc-bc82-eae480d1b094",
    "jalur_pendaftaran": "Mandiri",
    "status": "Menunggu",
    "created_at": "2024-04-07T06:53:09.538Z",
    "prodi": {
      "id": "e6314752-c753-47dc-bc82-eae480d1b094",
      "nama": "EXAMPLE 1",
      "universitas": {
        "id": "e6314752-c753-47dc-bc82-eae480d1b094",
        "nama": "EXAMPLE 1",
        "jenis": "NEGERI",
        "logo_url": "example.png"
      }
    },
    "pendaftar": {
      "id": "e6314752-c753-47dc-bc82-eae480d1b094",
      "nama": "EXAMPLE 1",
      "nisn": "0879780",
      "nik": "2674267282",
      "email": "example1@gmail.com",
      "jenis_kelamin": "L",
      "kewarganegaraan": "INDONESIA",
      "tempat_lahir": "JAKARTA",
      "tanggal_lahir": "2008-04-07",
      "agama": "-",
      "alamat_jalan": "JL. Example",
      "rt": "01",
      "rw": "03",
      "kelurahan": "x",
      "kecamatan": "x",
      "provinsi": "Jakarta Barat",
      "no_hp": "+97796",
      "no_wa": "+823423",
      "created_at": "2024-04-07T06:53:09.538Z",
      "asal_sekolah": {
        "id": "e6314752-c753-47dc-bc82-eae480d1b094",
        "nama": "SEKOLAH EXAMPLE 1"
      }
    }
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

## Edit Pendaftaran By Id
Endpoint: PUT /api/v1/pendaftaran/{id}\
Login: required

Request Type: application/json

Request Body:
```json
{
  "jalur_pendaftaran": "Beasiswa"
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

## Delete Pendaftaran By Id
Endpoint: DELETE /api/v1/pendaftar/{id}\
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

## Edit Status Pendaftaran
Endpoint: PATCH /api/v1/pendaftar/{id}/status\
Login: required

Request Type: application/json

Request Body:
```json
{
  "status": "Ditolak"
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

## Process All Pendaftaran
*for operator only

Endpoint: PATCH /api/v1/pendaftar/{id}/status/proses\
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
