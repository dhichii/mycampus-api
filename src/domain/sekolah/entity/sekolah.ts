import {v4 as uuid} from 'uuid';

export type AddSekolahReq = {
  nama: string;
}

export type AddSekolahInput = {
  id: string;
  nama: string;
}

export type GetAllSekolahInput = {
  search: string;
  limit: number;
  page: number;
}

export type EditSekolahReq = {
  id: string;
  nama: string;
}

export type EditSekolahInput = {
  nama: string;
}

export function mapAddSekolahReq(req: AddSekolahReq): AddSekolahInput {
  return {id: uuid(), nama: req.nama.toUpperCase()};
};

export function mapEditSekolahReq(req: EditSekolahReq): EditSekolahInput {
  return {nama: req.nama.toUpperCase()};
};
