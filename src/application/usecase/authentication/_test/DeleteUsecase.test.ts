import {AuthenticationRepositoryImpl}
  from '../../../../infrastructure/repository/AuthenticationRepositoryImpl';
import {DeleteAuthenticationUsecase} from '../DeleteUsecase';

describe('DeleteAuthenticationUsecase', () => {
  it('should orchestrating the get authentication correctly', async () => {
    const mockAuthenticationRepo = {} as AuthenticationRepositoryImpl;

    mockAuthenticationRepo.get = jest.fn(() => Promise.resolve({
      token: 'x',
      expires_at: new Date(),
      is_used: false,
    }));
    mockAuthenticationRepo.delete = jest.fn(() => Promise.resolve());

    const usecase = new DeleteAuthenticationUsecase(mockAuthenticationRepo);
    const deletedAuthentication = usecase.execute('x');

    expect(() => deletedAuthentication).not.toThrow(Error);
  });
});
