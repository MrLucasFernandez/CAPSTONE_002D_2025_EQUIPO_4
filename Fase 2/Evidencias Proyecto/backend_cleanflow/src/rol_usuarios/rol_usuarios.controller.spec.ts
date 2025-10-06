import { Test, TestingModule } from '@nestjs/testing';
import { RolUsuariosController } from './rol_usuarios.controller';
import { RolUsuariosService } from './rol_usuarios.service';

describe('RolUsuariosController', () => {
  let controller: RolUsuariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolUsuariosController],
      providers: [RolUsuariosService],
    }).compile();

    controller = module.get<RolUsuariosController>(RolUsuariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
