export type AddAdminReq = {
  email: string
  password: string
  nama: string
  jenis_kelamin: string
}

export type AddAdminInput = {
  id: string
  nama: string
  jenis_kelamin: string
}

export type GetAllAdminInput = {
  search: string
  limit: number
  page: number
}

export type GetAdminOutput = {
  id: string
  nama: string
  email: string
  jenis_kelamin: string
}

export type EditAdminReq = {
  id: string
  nama: string
  jenis_kelamin: string
}
export type EditAdminInput = {
  nama: string
  jenis_kelamin: string
}

export function mapAddAdminReq(req: AddAdminReq, id: string): AddAdminInput {
  return {
    id,
    nama: req.nama,
    jenis_kelamin: req.jenis_kelamin,
  };
}

export function mapEditAdminReq(req: AddAdminReq): EditAdminInput {
  return {
    nama: req.nama,
    jenis_kelamin: req.jenis_kelamin,
  };
}