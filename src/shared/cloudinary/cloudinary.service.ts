import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          use_filename: true,
          unique_filename: true,
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error('Upload failed: no result returned'));
          resolve(result);
        },
      );

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });
  }

  async deleteFile(urlOrPublicId: string) {
    let publicId = urlOrPublicId;

    if (urlOrPublicId.startsWith('http')) {
      const parts = urlOrPublicId.split('/');
      const uploadIndex = parts.findIndex((part) => part === 'upload');
      if (uploadIndex !== -1) {
        const remainingParts = parts.slice(uploadIndex + 1);
        if (
          remainingParts[0].startsWith('v') &&
          !isNaN(Number(remainingParts[0].substring(1)))
        ) {
          remainingParts.shift();
        }
        publicId = remainingParts.join('/').split('.')[0];
      }
    }

    return await cloudinary.uploader.destroy(publicId);
  }
}
