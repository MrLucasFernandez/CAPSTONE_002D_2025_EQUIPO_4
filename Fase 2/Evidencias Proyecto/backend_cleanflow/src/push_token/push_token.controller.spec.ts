import { Test, TestingModule } from '@nestjs/testing';
import { PushTokenController } from './push_token.controller';
import { PushTokenService } from './push_token.service';

describe('PushTokenController', () => {
  let controller: PushTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PushTokenController],
      providers: [PushTokenService],
    }).compile();

    controller = module.get<PushTokenController>(PushTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
