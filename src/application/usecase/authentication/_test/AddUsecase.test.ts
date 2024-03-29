import {Jwt} from '../../../../infrastructure/security/Jwt';
import {AddAuthenticationUsecase} from '../AddUsecase';
import {ResponseError} from '../../../../common/error/response-error';
import {AuthenticationRepository}
  from '../../../../domain/authentication/AuthenticationRepository';

describe('AddAuthenticationUsecase', () => {
  it('should throw response error', async () => {
    const mockAuthenticationRepo = {} as AuthenticationRepository;

    const usecase = new AddAuthenticationUsecase(mockAuthenticationRepo);

    try {
      await usecase.execute('x');
    } catch (e: any) {
      expect(e).toBeInstanceOf(ResponseError);
      expect(e.message).toEqual('sesi kadaluarsa, silahkan login kembali');
      expect(e.status).toEqual(401);
    }
  });

  it('should orchestrating the add authentication correctly', async () => {
    const jwt = new Jwt();
    const refreshToken = await jwt.createRefreshToken('x');

    const mockAuthenticationRepo = {} as AuthenticationRepository;

    mockAuthenticationRepo.add = jest.fn(() => Promise.resolve());

    const usecase = new AddAuthenticationUsecase(mockAuthenticationRepo);
    const addedAuthentication = await usecase.execute(refreshToken);

    expect(() => addedAuthentication).not.toThrow(ResponseError);
  });
});
