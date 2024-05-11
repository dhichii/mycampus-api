import {StatusPendaftaran} from '@prisma/client';
import {v4 as uuid} from 'uuid';

export type AddPendaftaranReq = {
  id_pendaftar: string
  id_prodi: string
  jalur_pendaftaran: string
}

export type AddPendaftaranInput = {
  id: string
  id_pendaftar: string
  id_prodi: string
  jalur_pendaftaran: string
}

export type GetAllPendaftaranInput = {
  limit: number
  page: number
  universitas?: number
  sekolah?: string
  prodi?: string
  status?: StatusPendaftaran
  nisn?: string
  userId?: string
}

export type GetAllPendaftaranOutput = {
  id: string
  jalur_pendaftaran: string
  status: string
  created_at: Date
  prodi: {
    id: string
    nama: string
    jenjang: string
    universitas: {
      id: number
      nama: string
      jenis: string
      logo_url: string
    }
  }
  pendaftar: {
    id: string
    nama: string
    nisn: string
  }
}

export type GetPendaftaranByIdOutput = {
  id: string
  jalur_pendaftaran: string
  status: string
  created_at: Date
  prodi: {
    id: string
    nama: string
    jenjang: string
    akreditasi: string
    biaya_pendaftaran: number
    ukt: number
    universitas: {
      id: number
      nama: string
      jenis: string
      logo_url: string
    }
  }
  pendaftar: {
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
    asal_sekolah: {
      id: string
      nama: string
    }
  }
}

export type EditPendaftaranReq = {
  id: string
  userId: string
  role: string
  jalur_pendaftaran: string
}

export type EditPendaftaranInput = {
  jalur_pendaftaran: string
}

export type DeletePendaftaranInput = {
  id: string
  userId: string
  role: string
}

export type EditStatusPendaftaranReq = {
  id: string
  role: string
  id_universitas: number
  status: string
}

export function mapAddPendaftaranReq(
    req: AddPendaftaranReq,
): AddPendaftaranInput {
  return {
    id: uuid(),
    id_pendaftar: req.id_pendaftar,
    id_prodi: req.id_prodi,
    jalur_pendaftaran: req.jalur_pendaftaran,
  };
}

export function mapEditPendaftaranReq(
    req: EditPendaftaranReq,
): EditPendaftaranInput {
  return {
    jalur_pendaftaran: req.jalur_pendaftaran,
  };
}
