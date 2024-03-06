import fs from 'fs';

export function deleteFile(path:string): Promise<void> {
  return fs.promises.unlink(path);
}
