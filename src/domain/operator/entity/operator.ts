export type AddOperatorReq = {
  email: string
  password: string
  nama: string
  jenis_kelamin: string
  id_universitas: number
}

export type AddOperatorInput = {
  id: string
  id_universitas: number
  nama: string
  jenis_kelamin: string
}

export type GetAllOperatorInput = {
  search?: string
  limit: number
  page: number
  universitas?: number
}

export type GetOperatorOutput = {
  id: string
  id_universitas: number
  nama: string
  email: string
  jenis_kelamin: string
  created_at: Date
  universitas: {
    id: number
    nama: string
  }
}

export type EditOperatorReq = {
  id: string
  nama: string
  jenis_kelamin: string
  id_universitas: number
}

export type EditOperatorInput = {
  nama: string
  jenis_kelamin: string
  id_universitas: number
}

export function mapAddOperatorReq(
    req: AddOperatorReq,
    id: string,
): AddOperatorInput {
  return {
    id,
    nama: req.nama.toUpperCase(),
    jenis_kelamin: req.jenis_kelamin,
    id_universitas: req.id_universitas,
  };
}

export function mapEditOperatorReq(req: EditOperatorReq): EditOperatorInput {
  return {
    nama: req.nama.toUpperCase(),
    jenis_kelamin: req.jenis_kelamin,
    id_universitas: req.id_universitas,
  };
}
