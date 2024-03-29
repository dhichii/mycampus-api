import {AuthenticationRepositoryImpl}
  from '../../../../infrastructure/repository/AuthenticationRepositoryImpl';
import {DeleteAuthenticationUsecase} from '../DeleteUsecase';

describe('DeleteAuthenticationUsecase', () => {
  it('should orchestrating the get authentication correctly', async () => {
    const mockAuthenticationRepo = {} as AuthenticationRepositoryImpl;

    mockAuthenticationRepo.delete = jest.fn(() => Promise.resolve());

    const usecase = new DeleteAuthenticationUsecase(mockAuthenticationRepo);
    const deletedAuthentication = usecase.execute('x');

    expect(() => deletedAuthentication).not.toThrow(Error);
    expect(mockAuthenticationRepo.delete).toHaveBeenCalledWith('x');
  });
});
