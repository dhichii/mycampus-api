import {
  Jenis_Universitas as JenisUniversitas,
  Jenjang,
  Status_Prodi as Status,
} from '@prisma/client';
import {v4 as uuid} from 'uuid';

export type AddProdiReq = {
  id: string
  id_universitas: number
  nama: string
  kode_prodi: number
  jenjang: Jenjang
  status: Status
  akreditasi: string
  biaya_pendaftaran: number
  ukt: number
  keterangan: string
  potensi_karir: {nama: string}[]
}

export type AddProdiInput = {
  id: string
  id_universitas: number
  nama: string
  kode_prodi: number
  jenjang: Jenjang
  status: Status
  akreditasi: string
  biaya_pendaftaran: number
  ukt: number
  keterangan: string
}

export type GetAllProdiInput = {
  search?: string
  limit: number
  page: number
  universitas?: number
  jenis_universitas?: JenisUniversitas
  status?: Status
  min_ukt?: number
  max_ukt?: number
}

export type GetAllProdiOutput = {
  id: string
  nama: string
  kode_prodi: number
  jenjang: string
  status: string
  akreditasi: string
  biaya_pendaftaran: number
  ukt: number
  universitas: {
    id: number
    nama: string
    jenis: string
    logo_url: string
  }
  potensi_karir: {
    id: number
    nama: string
  }[]
}

export type GetProdiByIdOutput = {
  id: string
  nama: string
  kode_prodi: number
  jenjang: string
  status: string
  akreditasi: string
  biaya_pendaftaran: number
  ukt: number
  keterangan: string
  universitas: {
    id: number
    nama: string
    jenis: string
    logo_url: string
  }
  potensi_karir: {
    id: number
    nama: string
  }[]
}

export type EditProdiReq = {
  id: string
  id_universitas: number
  nama: string
  kode_prodi: number
  jenjang: Jenjang
  status: Status
  akreditasi: string
  biaya_pendaftaran: number
  ukt: number
  keterangan: string
}

export type EditProdiInput = {
  id_universitas: number
  nama: string
  kode_prodi: number
  jenjang: Jenjang
  status: Status
  akreditasi: string
  biaya_pendaftaran: number
  ukt: number
  keterangan: string
}

export function mapAddProdiReq(req: AddProdiReq): AddProdiInput {
  return {
    id: uuid(),
    id_universitas: req.id_universitas,
    nama: req.nama.toUpperCase(),
    kode_prodi: req.kode_prodi,
    jenjang: req.jenjang,
    status: req.status,
    akreditasi: req.akreditasi,
    biaya_pendaftaran: req.biaya_pendaftaran,
    ukt: req.ukt,
    keterangan: req.keterangan,
  };
}

export function mapEditProdiReq(req: EditProdiReq): EditProdiInput {
  return {
    id_universitas: req.id_universitas,
    nama: req.nama.toUpperCase(),
    kode_prodi: req.kode_prodi,
    jenjang: req.jenjang,
    status: req.status,
    akreditasi: req.akreditasi,
    biaya_pendaftaran: req.biaya_pendaftaran,
    ukt: req.ukt,
    keterangan: req.keterangan,
  };
}
