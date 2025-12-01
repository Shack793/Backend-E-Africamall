import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return callback(
      new HttpException(
        'Only image files (jpg, jpeg, png, gif, webp) are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const documentFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(pdf|doc|docx|txt)$/)) {
    return callback(
      new HttpException(
        'Only document files (pdf, doc, docx, txt) are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const storageConfig = {
  storage: diskStorage({
    destination: './uploads/vendors',
    filename: (req, file, callback) => {
      const fileExtName = extname(file.originalname);
      const randomName = uuidv4();
      callback(null, `${randomName}${fileExtName}`);
    },
  }),
};

export const imageStorageConfig = {
  ...storageConfig,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
};

export const documentStorageConfig = {
  ...storageConfig,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
};