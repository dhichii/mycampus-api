# Pendaftar API Spec

## GET All Pendaftar
Endpoint: GET /api/v1/pendaftar\
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
- key: universitas\
  type: number\
  required: false
- key: nik\
  type: number\
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
        "nama": "EXAMPLE 1",
        "nisn": "0879780",
        "nik": 2674267282,
        "email": "example1@gmail.com",
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
        "nisn": "0879780",
        "nik": 2674267282,
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

## Get Pendaftar By Id
Endpoint: GET /api/v1/pendaftar/{id}\
Login: required

Response Body (Success):
```json
{
  "status": "success",
  "data": {
    "id": "e6314752-c753-47dc-bc82-eae480d1b094",
    "nama": "EXAMPLE 1",
    "nisn": "0879780",
    "nik": 2674267282,
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
    "no_hp": "097796",
    "no_wa": "0823423",
    "created_at": "2024-04-07T06:53:09.538Z",
    "asal_sekolah": {
      "id": "e6314752-c753-47dc-bc82-eae480d1b094",
      "nama": "SEKOLAH EXAMPLE 1"
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

## Edit Pendaftar By Id
Endpoint: PUT /api/v1/pendaftar/{id}\
Login: required

Request Type: application/json

Request Body:
```json
{
  "nama": "example",
  "nisn": "0879780",
  "nik": 2674267282,
  "jenis_kelamin": "L" or "P",
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
  "asal_sekolah": "SEKOLAH EXAMPLE X",
  "no_hp": "097796",
  "no_wa": "0823423",
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

## Delete Pendaftar By Id
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
