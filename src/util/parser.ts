import {ResponseError} from '../common/error/response-error';

export function parseNumber(field: string, v: string) {
  if (typeof(v) === 'undefined') {
    return v;
  }

  const res = parseInt(v);
  if (isNaN(res as number)) {
    throw new ResponseError(400, `${field} is not a number`);
  }

  return res;
};
