import { Test, TestingModule } from '@nestjs/testing';
import { DetalleBoletasController } from './detalle_boletas.controller';
import { DetalleBoletasService } from './detalle_boletas.service';

describe('DetalleBoletasController', () => {
  let controller: DetalleBoletasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleBoletasController],
      providers: [DetalleBoletasService],
    }).compile();

    controller = module.get<DetalleBoletasController>(DetalleBoletasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
