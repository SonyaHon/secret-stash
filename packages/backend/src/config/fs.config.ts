import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { extname } from 'path';

export class FsConfig {
  public static uploadedVideosPath = '/app/backend/uploaded-data/videos';
  public static uploadedImagesPath = '/app/backend/uploaded-data/images';

  public static imageStorage = diskStorage({
    destination: (req, file, callback) => {
      callback(null, FsConfig.uploadedImagesPath);
    },
    filename: (req, file, callback) => {
      const id = nanoid();
      const fileExtension = extname(file.originalname);
      callback(null, `${id}${fileExtension}`);
    },
  });

  public static videoStorage = diskStorage({
    destination: (req, file, callback) => {
      callback(null, FsConfig.uploadedVideosPath);
    },
    filename: (req, file, callback) => {
      const id = nanoid();
      const fileExtension = extname(file.originalname);
      callback(null, `${id}${fileExtension}`);
    },
  });
}
