import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs-extra';
import ftp from 'basic-ftp';
import AppError from '../../utils/app-error';
import catchAsync from '../../utils/catch-async';
import UserRequestMiddleware from '../../interfaces/user/user-request-middleware.i';
import { NextFunction, Response } from 'express';


class FileController {
  multerStorage;
  uploadImage;

  constructor() {
    this.multerStorage = multer.memoryStorage();
    this.uploadImage = this.upload().single('image');
  }


  private multerFilter(req: UserRequestMiddleware, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images', 400));
    }
  };

  private upload(): multer.Multer {
    return multer({
      storage: this.multerStorage,
      fileFilter: this.multerFilter,
    });
  }


  resizeImage = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }
    const ftpClient = new ftp.Client();
    const filename = `${req.user.id_user}${Date.now()}.jpeg`;
    req.file.filename = `https://${process.env.FRONTEND_ENDPOINT}/public/img/${filename}`;
    req.body.image = req.file.filename;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/${filename}`);

    console.log(filename);
    await ftpClient.access({
      host: process.env.FRONTEND_FTP_URL,
      user: process.env.FRONTEND_FTP_USER,
      password: process.env.FRONTEND_FTP_PASS,
      port: Number(process.env.FRONTEND_FTP_PORT)
    });

    console.log(fs.readFileSync(`${__dirname}/../public/img/${filename}`));
    await ftpClient.uploadFrom(`${__dirname}/../public/img/${filename}`, `public/img/${filename}`);
    this.deleteFile(filename);
    ftpClient.close()
    next();
  });

  deleteFile = (fileName: string) => {
    fs.removeSync(`${__dirname}/../public/img/${fileName}`);
  };

}

export default FileController;