import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class CloudinaryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/`;

    return next.handle().pipe(map((data) => this.transform(data, baseUrl)));
  }

  transform(data: any, baseUrl: string): any {
    if (Array.isArray(data))
      return data.map((item) => this.transform(item, baseUrl));
    if (data !== null && typeof data === 'object') {
      for (const key in data) {
        if (
          typeof data[key] === 'string' &&
          (key.toLowerCase().includes('url') ||
            key.toLowerCase().includes('image') ||
            key.toLowerCase().includes('avatar'))
        ) {
          if (data[key] && !data[key].startsWith('http')) {
            data[key] = `${baseUrl}${data[key]}`;
          }
        } else {
          data[key] = this.transform(data[key], baseUrl);
        }
      }
    }
    return data;
  }
}
