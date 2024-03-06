export type AddUniversitasReq = {
  nama: string;
  alamat: string;
  keterangan: string;
  logo_url: string;
}

export type AddUniversitasInput = {
  nama: string;
  alamat: string;
  keterangan: string;
  logo_url: string;
}

export type EditUniversitasReq = {
  id: number;
  nama: string;
  alamat: string;
  keterangan: string;
}

export type EditUniversitasInput = {
  nama: string;
  alamat: string;
  keterangan: string;
}

export type EditLogoUniversitasReq = {
  id: number;
  path: string;
  logo_url: string;
}

export function mapAddUniversitasReq(
    req: AddUniversitasReq,
): AddUniversitasInput {
  return {...req};
};

export function mapEditUniversitasReq(
    req: EditUniversitasReq,
): EditUniversitasInput {
  return {
    nama: req.nama,
    alamat: req.alamat,
    keterangan: req.keterangan,
  };
};
