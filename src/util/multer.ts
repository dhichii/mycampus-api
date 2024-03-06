import multer from 'multer';

export function createMulterDiskStorage(path: string) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
}

export function createMulterFileFilter(whitelist: string[]) {
  return (req: any, file: any, cb: any) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'));
    }

    cb(null, true);
  };
}
