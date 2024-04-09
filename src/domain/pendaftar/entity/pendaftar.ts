export type AddPendaftarReq = {
  nama: string
  nisn: string
  nik: string
  email: string
  password: string
  jenis_kelamin: string
  asal_sekolah: string
  kewarganegaraan: string
  tempat_lahir: string
  tanggal_lahir: string
  agama: string
  alamat_jalan: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  provinsi: string
  no_hp: string
  no_wa: string
}

export type AddPendaftarInput = {
  id: string
  nama: string
  nisn: string
  nik: string
  jenis_kelamin: string
  id_sekolah: string
  kewarganegaraan: string
  tempat_lahir: string
  tanggal_lahir: Date
  agama: string
  alamat_jalan: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  provinsi: string
  no_hp: string
  no_wa: string
}

export type GetAllPendaftarInput = {
  search?: string
  limit: number
  page: number
  sekolah?: string
  nik?: string
  nisn?: string
}

export type GetPendaftarOutput = {
  id: string
  nama: string
  nisn: string
  nik: string
  email: string
  jenis_kelamin: string
  created_at: Date
  asal_sekolah: {
    id: string
    nama: string
  }
}

export type GetPendaftarByIdOutput = {
  id: string
  nama: string
  nisn: string
  nik: string
  email: string
  jenis_kelamin: string
  kewarganegaraan: string
  tempat_lahir: string
  tanggal_lahir: string
  agama: string
  alamat_jalan: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  provinsi: string
  no_hp: string
  no_wa: string
  created_at: Date
  asal_sekolah: {
    id: string
    nama: string
  }
}

export type EditPendaftarReq = {
  id: string
  nama: string
  nisn: string
  nik: string
  jenis_kelamin: string
  asal_sekolah: string
  kewarganegaraan: string
  tempat_lahir: string
  tanggal_lahir: string
  agama: string
  alamat_jalan: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  provinsi: string
  no_hp: string
  no_wa: string
}

export type EditPendaftarInput = {
  nama: string
  nisn: string
  nik: string
  jenis_kelamin: string
  id_sekolah: string
  kewarganegaraan: string
  tempat_lahir: string
  tanggal_lahir: Date
  agama: string
  alamat_jalan: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  provinsi: string
  no_hp: string
  no_wa: string
}

export function mapAddPendaftarReq(
    req: AddPendaftarReq,
    id: string,
    idSekolah: string,
): AddPendaftarInput {
  return {
    id,
    id_sekolah: idSekolah,
    nama: req.nama.toUpperCase(),
    nisn: req.nisn,
    nik: req.nik,
    jenis_kelamin: req.jenis_kelamin,
    kewarganegaraan: req.kewarganegaraan.toUpperCase(),
    tempat_lahir: req.tempat_lahir.toUpperCase(),
    tanggal_lahir: new Date(req.tanggal_lahir),
    agama: req.agama.toUpperCase(),
    alamat_jalan: req.alamat_jalan.toUpperCase(),
    rt: req.rt,
    rw: req.rw,
    kelurahan: req.kelurahan.toUpperCase(),
    kecamatan: req.kecamatan.toUpperCase(),
    provinsi: req.provinsi.toUpperCase(),
    no_hp: req.no_hp,
    no_wa: req.no_wa,
  };
}

export function mapEditPendaftarReq(
    req: EditPendaftarReq,
    idSekolah: string,
): EditPendaftarInput {
  return {
    id_sekolah: idSekolah,
    nama: req.nama.toUpperCase(),
    nisn: req.nisn,
    nik: req.nik,
    jenis_kelamin: req.jenis_kelamin,
    kewarganegaraan: req.kewarganegaraan.toUpperCase(),
    tempat_lahir: req.tempat_lahir.toUpperCase(),
    tanggal_lahir: new Date(req.tanggal_lahir),
    agama: req.agama.toUpperCase(),
    alamat_jalan: req.alamat_jalan.toUpperCase(),
    rt: req.rt,
    rw: req.rw,
    kelurahan: req.kelurahan.toUpperCase(),
    kecamatan: req.kecamatan.toUpperCase(),
    provinsi: req.provinsi.toUpperCase(),
    no_hp: req.no_hp,
    no_wa: req.no_wa,
  };
}
