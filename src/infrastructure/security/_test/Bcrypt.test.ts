import {ResponseError} from '../../../common/error/response-error';
import {Bcrypt} from '../Bcrypt';

describe('Bcrypt', () => {
  describe('on hash function', () => {
    it('should hash password', async () => {
      const password = 'example';
      const hashedPassword = new Bcrypt().hash(password);

      expect(hashedPassword).not.toEqual(password);
    });
  });

  describe('on compare function', () => {
    it('should return 404 when invalid password', async () => {
      try {
        await new Bcrypt().compare('x', 'xx');
      } catch (e: any) {
        expect(e.status).toEqual(404);
        expect(e.message).toEqual('email atau password salah');
      }
    });

    it('should not password correctly', async () => {
      const bcrypt = new Bcrypt();
      const password = 'example';
      const hashedPassword = await bcrypt.hash(password);

      await expect(bcrypt.compare(password, hashedPassword))
          .resolves.not.toThrow(ResponseError);
    });
  });
});
