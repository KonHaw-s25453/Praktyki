import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return greeting from service', () => {
    const spy = jest
      .spyOn(service, 'getHello')
      .mockReturnValue('CMS TEST');

    const result = controller.getHello();

    expect(result).toBe('CMS TEST');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});