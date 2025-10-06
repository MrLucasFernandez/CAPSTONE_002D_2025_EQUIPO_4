import { Test, TestingModule } from '@nestjs/testing';
import { RolUsuariosService } from './rol_usuarios.service';

describe('RolUsuariosService', () => {
  let service: RolUsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolUsuariosService],
    }).compile();

    service = module.get<RolUsuariosService>(RolUsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
