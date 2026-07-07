import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('should return the correct greeting message', () => {
      const result = service.getHello();
      expect(result).toBe('System Zarządzania Treścią (CMS) dla Digital Signage');
    });

    it('should return a non-empty string', () => {
      const result = service.getHello();
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
});
