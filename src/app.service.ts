import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'System Zarządzania Treścią (CMS) dla Digital Signage';
  }
}
