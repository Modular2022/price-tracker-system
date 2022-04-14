import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs-extra';
import ftp from "basic-ftp';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';


class FileController {
  multerStorage;

  constructor() {
    this.multerStorage = multer.memoryStorage();
  }


  private multerFilter(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images', 400), false);
    }
  };

  private upload() {
    return multer({
      storage: this.multerStorage,
      fileFilter: this.multerFilter,
    });
  }
  uploadImage = this.upload.single('image');

  resizeImage = catchAsync(async (req, res, next) => {
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
      port: process.env.FRONTEND_FTP_PORT
    });

    console.log(fs.readFileSync(`${__dirname}/../public/img/${filename}`));
    await ftpClient.uploadFrom(`${__dirname}/../public/img/${filename}`, `public/img/${filename}`);
    this.deleteFile(filename);
    ftpClient.close()
    next();
  });

  deleteFile = (fileName) => {
    fs.removeSync(`${__dirname}/../public/img/${fileName}`);
  };

}