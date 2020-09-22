import multer, { Options } from 'multer';
import crypto from 'crypto';
import path from 'path';

interface IUploadConfig {
  driver: 'disk' | 's3';

  uploadsFolder: string;
  tmpFolder: string;

  multer: Options;

  config: {
    s3: {
      bucket: string;
    };
  };
}

const uploadsFolder = path.resolve(__dirname, '..', '..', 'uploads');
const tmpFolder = path.resolve(uploadsFolder, 'tmp');

const uploadConfig = {
  driver: process.env.STORAGE_DRIVER || 'disk',

  uploadsFolder,
  tmpFolder,

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename: (request, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    s3: {
      bucket: 'gobarber-gabrielkim13',
    },
  },
} as IUploadConfig;

export default uploadConfig;
