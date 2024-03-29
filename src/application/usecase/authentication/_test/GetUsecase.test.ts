import {ResponseError} from '../../../../common/error/response-error';
import {AuthenticationRepository}
  from '../../../../domain/authentication/AuthenticationRepository';
import {Jwt} from '../../../../infrastructure/security/Jwt';
import {GetAuthenticationUsecase} from '../GetUsecase';

describe('GetAuthenticationUsecase', () => {
  it('should throw response error', async () => {
    const mockAuthenticationRepo = {} as AuthenticationRepository;

    mockAuthenticationRepo.get = jest.fn(() => Promise.resolve({
      token: 'x',
      expires_at: new Date(),
      is_used: false,
    }));
    mockAuthenticationRepo.delete = jest.fn(() => Promise.resolve());

    const usecase = new GetAuthenticationUsecase(mockAuthenticationRepo);

    try {
      await usecase.execute('x');

      expect(mockAuthenticationRepo.get).toHaveBeenCalledWith('x');
      expect(mockAuthenticationRepo.delete).toHaveBeenCalledWith('x');
    } catch (e: any) {
      expect(e).toBeInstanceOf(ResponseError);
      expect(e.message).toEqual('sesi kadaluarsa, silahkan login kembali');
      expect(e.status).toEqual(401);
    }
  });

  it('should orchestrating the get authentication correctly', async () => {
    const jwt = new Jwt();
    const refreshToken = await jwt.createRefreshToken('x');

    const mockAuthenticationRepo = {} as AuthenticationRepository;

    mockAuthenticationRepo.get = jest.fn(() => Promise.resolve({
      token: refreshToken,
      expires_at: new Date(),
      is_used: false,
    }));
    mockAuthenticationRepo.delete = jest.fn(() => Promise.resolve());

    const usecase = new GetAuthenticationUsecase(mockAuthenticationRepo);
    const authentication = await usecase.execute(refreshToken);

    expect(() => authentication).not.toThrow(ResponseError);
  });
});
