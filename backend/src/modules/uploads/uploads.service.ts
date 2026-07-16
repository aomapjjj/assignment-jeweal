import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}

  buildSlipResponse(file: Express.Multer.File) {
    const baseUrl =
      this.configService.get<string>('APP_BASE_URL') ?? 'http://localhost:3000';

    // main.ts should serve ./uploads statically at this same prefix, e.g.:
    //   app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
    const url = `${baseUrl}/uploads/slips/${file.filename}`;

    return {
      url,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  /*
   * Swap-in point for Sprint 6+ hardening: replace diskStorage in
   * UploadsController with a Cloudinary/Supabase upload here and return
   * their hosted URL instead. Keep the same response shape ({ url, ... })
   * so PaymentsService and the frontend never need to change.
   */
}
