import { Injectable, BadRequestException } from '@nestjs/common';
import { UppedFile } from './models/upped-file';
import { Archiver, create as archiver } from 'archiver';

@Injectable()
export class AppService {
  deflate(files: UppedFile[], attachments: string): Archiver {
    if (files == null || files.length === 0) {
      throw new BadRequestException('At least one file must be given');
    }
    const zip = archiver('zip');
    const attArray = attachments != null ? attachments.split(';') : [];
    console.log(files.length);
    for (const file of files) {
      const name =
        (attArray.includes(file.originalname) ? 'resources/' : '') +
        file.originalname;
      console.log(name);
      zip.append(file.buffer, { name });
    }
    return zip;
  }
}
