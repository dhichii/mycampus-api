export type AddPotensiKarirReq = {
  nama: string
}

export type AddPotensiKarirInput = {
  nama: string
}

export type GetAllPotensiKarirInput = {
  search?: string
  limit: number
  page: number
}

export type EditPotensiKarirReq = {
  id: number
  nama: string
}

export type EditPotensiKarirInput = {
  nama: string
}

export function mapAddPotensiKarirReq(
    req: AddPotensiKarirReq,
): AddPotensiKarirInput {
  return {
    nama: req.nama.toUpperCase(),
  };
};

export function mapEditPotensiKarirReq(
    req: EditPotensiKarirReq,
): EditPotensiKarirInput {
  return {
    nama: req.nama.toUpperCase(),
  };
};
