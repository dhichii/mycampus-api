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

## Register Pendaftar
Endpoint: POST /api/v1/akun/register/pendaftar\
Login: required

Request Type: application/json

Request Body:
```json
{
  "nama": "example",
  "email": "example1@gmail.com",
  "password": "12345678",
  "nik": "3400000001924671",
  "nisn": "5672832432",
  "jenis_kelamin": "L" or "P",
  "asal_sekolah": "SMA NEGERI 1 X",
  "kewarganegaraan": "INDONESIA",
  "tempat_lahir": "JAKARTA",
  "tanggal_lahir": "2008-04-07",
  "agama": "NONE",
  "alamat_jalan": "JL. Example",
  "rt": "01",
  "rw": "03",
  "kelurahan": "x",
  "kecamatan": "x",
  "provinsi": "Jakarta Barat",
  "no_hp": "+62821626724",
  "no_wa": "+62821626724"
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

## Register Pihak Sekolah
Endpoint: POST /api/v1/akun/register/sekolah\
Login: required

Request Type: application/json

Request Body:
```json
{
  "nama": "example",
  "email": "example1@gmail.com",
  "password": "12345678",
  "jabatan": "KEPALA SEKOLAH",
  "jenis_kelamin": "L" or "P",
  "alamat": "jl example",
  "asal_daerah": "Kec. X JAKARTA BARAT",
  "no_hp": "0821626724",
  "no_wa": "0821626724",
  "asal_sekolah": "SMA NEGERI 1 X"
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
