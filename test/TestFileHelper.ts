/* istanbul ignore file */
import fs from 'fs';

export const TestFileHelper = {
  async copy(fileName = 'test-img.png') {
    const dir = 'public/';
    fs.copyFile('test/test-img.png', dir + fileName, (err) => {
      if (err) throw err;
    });

    return fileName;
  },
  async delete(fileName = 'test-img.png', path = 'public/') {
    fs.promises.unlink(path + fileName);
  },
};
