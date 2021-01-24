import {
  Controller,
  Get,
  Post,
  Query,
  Response,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { UppedFile } from './models/upped-file';
import { Response as Res } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return (
      'Welcome to our Packaging Service.\n' +
      'POST up to 14 files as "files" form field to have them returned in a zip archive. ' +
      'Those with the name provided in the query param "attachments" (semicolon-separated) will be put ' +
      'into a "resources" subdirectory. '
    );
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 14))
  async deflate(
    @UploadedFiles() files: UppedFile[],
    @Query('attachments') attachments: string,
    @Response() res: Res,
  ): Promise<void> {
    const zip = this.appService.deflate(files, attachments);
    zip.pipe(res);
    await zip.finalize();
  }
}
