import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/:id')
  async streamFile(
    @Param('id') fileId: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const file = await this.fileService.getFile(fileId);
    const { path, size, mimetype } = file;

    if (request.headers.range) {
      const [startPoint, endPoint] = request.headers.range
        .replace(/bytes=/, '')
        .split('-');

      const start = parseInt(startPoint);
      const end = endPoint ? parseInt(endPoint) : size - 1;

      response.writeHead(HttpStatus.PARTIAL_CONTENT, {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': mimetype,
      });

      createReadStream(path, { start, end }).pipe(response);
    } else {
      response.writeHead(HttpStatus.OK, {
        'Content-Length': size,
        'Content-Type': mimetype,
      });
      createReadStream(path).pipe(response);
    }
  }
}
