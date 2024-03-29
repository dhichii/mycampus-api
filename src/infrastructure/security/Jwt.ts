import jwt from 'jsonwebtoken';

export type JwtAccessPayload = {
  id: string;
  nama: string;
  email: string;
  role: string;
}

export class Jwt {
  async createAccessToken(payload: JwtAccessPayload) {
    return jwt.sign(
        {...payload},
        process.env.ACCESS_TOKEN_KEY as string,
        {expiresIn: process.env.ACCESS_TOKEN_AGE as string},
    );
  }

  async verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string);
  }

  async createRefreshToken(id: string) {
    return jwt.sign(
        {id},
      process.env.REFRESH_TOKEN_KEY as string,
      {expiresIn: process.env.REFRESH_TOKEN_AGE as string},
    );
  }

  async verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.REFRESH_TOKEN_KEY as string);
  }

  mapAccessPayload(payload: JwtAccessPayload) {
    return {
      id: payload.id,
      nama: payload.nama,
      email: payload.nama,
      role: payload.role,
    };
  }
}
